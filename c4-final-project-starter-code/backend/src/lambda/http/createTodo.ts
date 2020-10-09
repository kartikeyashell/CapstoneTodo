import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todoItems'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    logger.info('Processing CreateTodo event: ', event)

    const newItem = await createTodo(newTodo, event)
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  } catch (error) {
    logger.error('Error during creation of Todo item: ', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    }   
  }
}
