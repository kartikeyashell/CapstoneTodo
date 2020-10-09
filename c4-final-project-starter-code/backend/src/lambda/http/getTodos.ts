import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getTodosForUser } from '../../businessLogic/todoItems'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {
    const todosForUser = await getTodosForUser(event)

    logger.info('Processing GetTodo event: ', event)
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: todosForUser
      })
    }
  } catch (error) {
    logger.error('Error during fetch of Todo items for the user: ', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    }   
  }
}
