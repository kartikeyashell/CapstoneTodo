import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAttachmentUploadUrl } from '../../businessLogic/todoItems'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    try {
        const todoId = event.pathParameters.todoId

        logger.info('Getting a presigned URL to upload file for a Todo item...')
      
        // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
        const uploadUrl = getAttachmentUploadUrl(todoId)
      
        return {
              statusCode: 200,
              headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true
              },
              body: JSON.stringify({
                  uploadUrl
              })
          }
      } catch (error) {
        logger.error('Error during processing of attachment upload url: ', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({
            error
          })
        }   
      }
}
