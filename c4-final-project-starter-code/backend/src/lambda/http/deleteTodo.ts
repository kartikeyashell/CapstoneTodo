import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todoItems'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  try {
    const todoId = event.pathParameters.todoId

    logger.info('Processing DeleteTodo event: ', event)

    await deleteTodo(todoId, event)
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''  
    }
  } catch (error) {
    logger.error('Error during deletion of Todo item: ', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    }   
  }
}
