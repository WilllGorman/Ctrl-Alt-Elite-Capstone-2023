import { Construct } from 'constructs';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

// Defines project output
const path = './resources/build';

// extends Construct is best practice for creating stack
export class DeploymentService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Create S3 Bucket to hold React application
        const hostingBucket = new Bucket(this, "FrontendBucket", {
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
        });
        
        // 
        const distribution = new Distribution(this, 'CloudfrontDistribution', {
            defaultBehavior: {
                origin: new S3Origin(hostingBucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            // Entry point of application
            defaultRootObject: "index.html",
            // Error repsonses for accessing the Cloudfront distribution
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                },
            ],
        });

        // Deploys solution to bucket
        // Copies project over to bucket, and clears the CDN cache - only new project is pulled.
        new BucketDeployment(this, 'BucketDeployment', {
            sources: [Source.asset(path)],
            destinationBucket: hostingBucket,
            distribution,
            distributionPaths: ["/*"], // Tells CDK to clear the CDN cache to ensure newest project is pulled
        });

        // Outputs to generate link for URL
        new CfnOutput(this, 'CloudFrontURL', {
            value: distribution.domainName,
            description: "This Distribution URL",
            exportName: "CloudfrontURL",
        });
        
        // Output to generate Bucket name in console
        new CfnOutput(this, "BucketName", {
            value: hostingBucket.bucketName,
            description: "The name of the S3 bucket",
            exportName: "BucketName",
        });
    }
}