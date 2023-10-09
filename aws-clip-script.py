#!/usr/bin/env python
# coding: utf-8

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
from datasets import load_dataset
from collections import OrderedDict
from transformers import CLIPProcessor, CLIPModel, CLIPTokenizer
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity
import boto3
from dotenv import load_dotenv


# # Dataset Integrity Verification

load_dotenv()

app = Flask(__name__)
CORS(app)

# IMPORTANT - PLZ DO NOT SHARE MY AWS ACCESS CODE + REMOVE BEFORE UPLOADING TO GITHUB
# Possibly find a way to set environment variables in bash and access using that instead of storing here.
s3 = boto3.client("s3", 
                  aws_access_key_id=os.environ["AWS_ACCESS_KEY"], 
                  aws_secret_access_key=os.environ["AWS_SECRET_KEY"], 
                  region_name=os.environ["AWS_REGION"])

# ## Load Data
def initialise():
    paths = [path.parts[-2:] for path in
             Path(image_dir_path).rglob('*.jpg')]
    image_data_df = pd.DataFrame(data=paths, columns=['subfolder','image_url'])
    image_data_df["image"] = image_data_df["image_url"].apply(get_image)
    return image_data_df


def get_image(image_URL):
    image = Image.open(os.path.join(image_dir_path + '/' + image_URL))
    return image


def get_model_info(model_ID, device):

  # Save the model to device
  model = CLIPModel.from_pretrained(model_ID).to(device)
  # Get the processor
  processor = CLIPProcessor.from_pretrained(model_ID)
  # Get the tokenizer
  tokenizer = CLIPTokenizer.from_pretrained(model_ID)
  # Return model, processor & tokenizer
  return model, processor, tokenizer


def get_single_text_embedding(text):
  inputs = tokenizer(text, return_tensors = "pt").to(device)
  text_embeddings = model.get_text_features(**inputs)
  embedding_as_np = text_embeddings.cpu().detach().numpy()
  return embedding_as_np


def get_single_image_embedding(my_image):
  image = processor(
      text = None,
      images = my_image, 
      return_tensors="pt"
  )["pixel_values"].to(device)
  embedding = model.get_image_features(image)
  embedding_as_np = embedding.cpu().detach().numpy()

  return embedding_as_np


def get_all_images_embedding(df, img_column):
  df["img_embeddings"] = df[str(img_column)].apply(get_single_image_embedding)
  return df


def plot_images_by_side(top_images):

  index_values = list(top_images.index.values)
  list_images = [top_images.iloc[idx].image for idx in index_values] 
  #list_captions = [top_images.iloc[idx].caption for idx in index_values] 
  similarity_score = [top_images.iloc[idx].cos_sim for idx in index_values] 

  n_row = n_col = 2

  _, axs = plt.subplots(n_row, n_col, figsize=(12, 12))
  axs = axs.flatten()
  for img, ax, sim_score in zip(list_images, axs, similarity_score):
      ax.imshow(img)
      sim_score = 100*float("{:.2f}".format(sim_score))
      ax.title.set_text(f"Caption: null\nSimilarity: {sim_score}%")
  plt.show()


# # Perform Similarity Search: Cosine 

def get_top_N_images(query, data, top_K=4, search_criterion="text"):
    """
    Retrieve top_K (4 is default value) articles similar to the query
    """
    # Text to image Search
    if(search_criterion.lower() == "text"):
      query_vect = get_single_text_embedding(query)
    # Image to image Search
    else: 
      query_vect = get_single_image_embedding(query)
    # Relevant columns
    revevant_cols = ["image_url", "cos_sim"]
    # Run similarity Search
    data["cos_sim"] = data["img_embeddings"].apply(lambda x: cosine_similarity(query_vect, x))
    data["cos_sim"] = data["cos_sim"].apply(lambda x: x[0][0])
    """
    Sort Cosine Similarity Column in Descending Order 
    Here we start at 1 to remove similarity with itself because it is always 1
    """
    most_similar_articles = data.sort_values(by='cos_sim', ascending=False)[1:top_K+1]
    return most_similar_articles[revevant_cols].reset_index()

@app.route("/api/results", methods=["GET"])
def flaskyboy():
   search_type = request.args.get("searchType")
   if search_type == "text":
      search_phrase = request.args.get("searchPhrase")
      
   elif search_type == "image":
      image_name = request.args.get("imgName")
      image_name = image_name + ".jpg"      
      # CHANGE TO LOCAL PATH - add \\ at the end of rstring
      local_path = os.path.join(image_dir_path + '/' + image_name)
      

      if s3_download("ctrl-alt-elite-user-image-upload", image_name, local_path):
         search_phrase = get_image(image_name)
        #  search_phrase.close()
      else: 
         return jsonify({"error": "Failed to download image"}), 500

   results = get_top_N_images(search_phrase, image_data_df, search_criterion=search_type)
   send = {"message" : "recieved!",
           "results" : f"{results.to_json(orient='records')}",
           "searchType" : f"{search_type}"}
   
   return send

def s3_download(bucket, key, local_path): 
   try: 
      s3.download_file(bucket, key, local_path)
      return True
   except Exception as e: 
      print("Error downloading image: ", e)
      return False

if __name__ == "__main__":
    image_dir_path = os.path.join(os.path.expanduser('~'), 'Capstone', 'images', 'master')
    image_data_df = initialise()
    device = "cpu"
    model_ID = "openai/clip-vit-base-patch32"
    model, processor, tokenizer = get_model_info(model_ID, device)
    image_data_df = get_all_images_embedding(image_data_df, "image")
    app.run(host="0.0.0.0", port=8000)
