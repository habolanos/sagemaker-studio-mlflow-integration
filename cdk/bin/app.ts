#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MLflowVpcStack } from '../lib/mlflow-vpc-stack';
import { RestApiGatewayStack } from '../lib/rest-api-gateway-stack';
import { SageMakerStudioUserStack } from '../lib/sagemaker-studio-user-stack';
import { AmplifyMlflowStack } from '../lib/amplify-mlflow-stack';
const env = { region: (process.env['AWS_REGION'] || 'us-west-2'), account: process.env['AWS_ACCOUNT'] };

const domainId = (process.env['DOMAIN_ID'] || "" )

const app = new cdk.App();

const mlflowVpcStack = new MLflowVpcStack(
    app,
    'MLflowVpcStack',
    { env: env }
);

const restApiGatewayStack = new RestApiGatewayStack(
    app,
    'RestApiGatewayStack',
    mlflowVpcStack.httpApiInternalNLB,
    { env: env }
);

new SageMakerStudioUserStack(
    app,
    'SageMakerStudioUserStack',
    RestApiGatewayStack.name,
    restApiGatewayStack.restApi,
    domainId,
    { env: env }
)

new AmplifyMlflowStack(
    app,
    'AmplifyMlflowStack',
    restApiGatewayStack.restApi,
    restApiGatewayStack.userPool,
    restApiGatewayStack.identityPool,
    restApiGatewayStack.userPoolClient,
    { env: env }
)