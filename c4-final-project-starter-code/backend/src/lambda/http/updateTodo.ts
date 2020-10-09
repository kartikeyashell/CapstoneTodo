import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todoItems'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  
    logger.info('Processing UpdateTodo event: ', event)
  
    await updateTodo(todoId, updatedTodo, event)
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  } catch (error) {
    logger.error('Error during update of Todo item: ', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    }   
  }
}
