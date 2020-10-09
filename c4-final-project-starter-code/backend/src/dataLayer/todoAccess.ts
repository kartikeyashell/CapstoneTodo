import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todoAccess')

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3 = new XAWS.S3({
          signatureVersion: 'v4'
        }),
        private readonly todoTable = process.env.TODO_TABLE,
        private readonly todoIndex = process.env.INDEX_NAME,
        private readonly bucketName = process.env.TODO_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {
    }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {

      logger.info('Fetching todo items for %', userId)
      
      const result = await this.docClient.query({
          TableName: this.todoTable,
          IndexName: this.todoIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
      }).promise()

      const items = result.Items
      return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {

      logger.info('Creating a new todo item...')
      
      await this.docClient.put({
        TableName: this.todoTable,
        Item: todo
      }).promise()

      return todo
    }

    async updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<void> {

      logger.info('Updating existing todo item % for user %', todoId, userId)
      
      await this.docClient.update({
        TableName: this.todoTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        ExpressionAttributeNames: {"#N": "name"},
        UpdateExpression: 'set #N = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':dueDate': updatedTodo.dueDate,
          ':done': updatedTodo.done
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()
    }

    async deleteTodo(userId: string, todoId: string): Promise<void> {

      logger.info('Deleting todo item % for user %', todoId, userId)

      await this.docClient.delete({
        TableName: this.todoTable,
        Key: {
          todoId,
          userId
        }
      }).promise()
    }

    getAttachmentUploadUrl(todoId: string) {

      return this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: todoId,
        Expires: this.urlExpiration
      })
    }
}