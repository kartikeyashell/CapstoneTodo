import { APIGatewayProxyEvent } from "aws-lambda";
import { TodoAccess } from "../dataLayer/todoAccess";
import { getUserId } from "../lambda/utils";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import * as uuid from 'uuid'
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";


const todoAccess = new TodoAccess()

export async function getTodosForUser(event: APIGatewayProxyEvent): Promise<TodoItem[]> {

    const userId = getUserId(event)
    const todosForUser = todoAccess.getTodosForUser(userId)

    return todosForUser    
}

export async function createTodo(newTodo: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> {
  
  const todoId = uuid.v4()
  const userId = getUserId(event)
  const createdAt = new Date().toISOString()
  const imagesBucket = process.env.TODO_S3_BUCKET
  const attachmentUrl = `https://${imagesBucket}.s3.amazonaws.com/${todoId}`

  return await todoAccess.createTodo({
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: attachmentUrl,
    ...newTodo
  })
}

export async function updateTodo(todoId: string, updatedTodo: UpdateTodoRequest, event: APIGatewayProxyEvent): Promise<void> {
  
  const userId = getUserId(event)
  return await todoAccess.updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodo(todoId: string, event: APIGatewayProxyEvent): Promise<void> {
  
  const userId = getUserId(event)

  return await todoAccess.deleteTodo(userId, todoId)
}

export function getAttachmentUploadUrl(todoId: string) {

  return todoAccess.getAttachmentUploadUrl(todoId)
}