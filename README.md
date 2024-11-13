# Assignment
### 1\. API Documentation

For documentation, use a format that includes the endpoint URL, HTTP method, request parameters, and responses.

#### **1.1 Upload API**

*   **Endpoint**: /api/images/upload
    
*   **Method**: POST
    
*   **Description**: Accepts a CSV file, validates it, and returns a unique request ID.
    
*   **Headers**: Content-Type: multipart/form-data
    
*   **Request**: csvFile (form-data)
    
    *   **Type**: File
        
    *   **Required**: Yes
        
    *   **Description**: A CSV file containing serial number, product name, and image URLs.
        
*   **Response**:
    
    *   jsonCopy code{ "requestId": "unique-request-id"}
        
    *   jsonCopy code{ "error": "Failed to upload CSV data"}
        
*   bashCopy codecurl -X POST http://localhost:5000/api/images/upload \\-F 'csvFile=@path/to/yourfile.csv'
    

#### **1.2 Status API**

*   **Endpoint**: /api/images/status/:requestId
    
*   **Method**: GET
    
*   **Description**: Checks the processing status of a request using the requestId.
    
*   **Path Parameters**:
    
    *   requestId - (String) Unique ID returned by the upload endpoint.
        
*   **Response**:
    
    *   jsonCopy code{ "status": "Pending"}
        
    *   jsonCopy code{ "message": "No records found"}
        
    *   jsonCopy code{ "error": "Failed to check status"}
        
*   bashCopy codecurl -X GET http://localhost:5000/api/images/status/unique-request-id
    

### 2\. Asynchronous Workers Documentation

In this setup, asynchronous image processing happens within services/imageProcessingService.js. Here’s a breakdown of the workers:

#### **Worker Functions**

1.  **processImages**
    
    *   **Description**: This function takes a requestId and an array of product documents, processes each product’s image URLs by compressing them, and updates the database with output image URLs and status.
        
    *   **Steps**:
        
        1.  Iterates over each product document.
            
        2.  For each input image URL, it fetches the image, compresses it to 50% of its original size, and uploads it to a storage service.
            
        3.  Stores the new (output) image URLs in the database for each product and updates the processing status to Completed.
            
2.  **fetchAndCompressImage**
    
    *   **Description**: Downloads an image from a URL, compresses it using the sharp library, and returns the compressed image buffer.
        
    *   **Steps**:
        
        1.  Fetches the image data from the given URL.
            
        2.  Uses sharp to resize the image and return a buffer with reduced quality.
            
3.  **uploadToStorage**
    
    *   **Description**: This is a placeholder function where compressed images are uploaded to a cloud storage provider, and it returns the public URL of the uploaded image.
        
    *   **Note**: In a real implementation, this would integrate with a service like Amazon S3 or Google Cloud Storage to save the image and retrieve the URL.