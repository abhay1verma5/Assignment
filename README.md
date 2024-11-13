> **API Documentation**
>
> **Base URL:**
>
> http://localhost:5000/api/images
>
> **Endpoints**
>
> **1. Upload CSV File**
>
> ● **POST** /upload\
> ● **Description**: This endpoint allows you to upload a CSV file
> containing product information, including serial numbers, product
> names, and image URLs. The data is processed, and image URLs are
> updated.

+-----------------+-----------------+-----------------+-----------------+
| ●               | > **Request     |                 |                 |
|                 | > Body**:       |                 |                 |
| ●               |                 |                 |                 |
+=================+=================+=================+=================+
|                 | ○               | > **            |                 |
|                 |                 | Content-Type**: |                 |
|                 |                 | > mult          |                 |
|                 |                 | ipart/form-data |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 | ○               | > **Form        |                 |
|                 |                 | > Data**:       |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 | ■               |                 | > csvFile: The  |
|                 |                 |                 | > CSV file to   |
|                 |                 |                 | > be uploaded.  |
+-----------------+-----------------+-----------------+-----------------+
|                 | > **Response**: |                 |                 |
+-----------------+-----------------+-----------------+-----------------+

> **Success (200)**:\
> json\
> Copy code\
> {\
> \"requestId\": \"unique-request-id\"\
> }
>
> ○
>
> **Error (500)**:\
> json\
> Copy code\
> {\
> \"error\": \"Failed to upload CSV data\"\
> }
>
> ○
>
> **2. Check Status**

+-----------------------+-----------------------+-----------------------+
| > ●\                  | > **GET**             |                       |
| > ●\                  | > /status/:requestId\ |                       |
| > ●                   | > **Description**:    |                       |
|                       | > Fetches the status  |                       |
| ●                     | > of a product        |                       |
|                       | > request by          |                       |
|                       | > requestId.          |                       |
|                       | >                     |                       |
|                       | > **Parameters**:     |                       |
+=======================+=======================+=======================+
|                       | ○                     | > requestId (URL      |
|                       |                       | > parameter): The     |
|                       |                       | > unique ID assigned  |
|                       |                       | > to the product      |
|                       |                       | > request.            |
+-----------------------+-----------------------+-----------------------+
|                       | > **Response**:       |                       |
+-----------------------+-----------------------+-----------------------+

> **Success (200)**:\
> json\
> Copy code\
> {\
> \"message\": \"data\",\
> \"status\": \[\
> {\
> \"serialNumber\": 12345,\
> \"productName\": \"Example Product\",\
> \"inputImageUrls\": \[\"https://example.com/image1.jpg\"\],\
> \"outputImageUrls\": \[\"https://example.com/compressed_image.jpg\"\],
> \"requestId\": \"unique-request-id\",\
> \"status\": \"Completed\",\
> \"updatedAt\": \"2024-11-14T12:00:00Z\"\
> }\
> \]\
> }
>
> ○
>
> **Error (404)**:\
> json\
> Copy code\
> {\
> \"message\": \"No records found\"\
> }
>
> ○
>
> **Error (500)**:\
> json\
> Copy code\
> {\
> \"error\": \"Failed to check status\"
>
> }
>
> ○
>
> **3. Update Product Status**
>
> ● **POST** /webhook\
> ● **Description**: Updates the status of products in a given request
> based on the provided status. Typically used by webhook listeners.
>
> **Request Body**:\
> json\
> Copy code\
> {\
> \"requestId\": \"unique-request-id\",\
> \"status\": \"Completed\"\
> }
>
> ●\
> ● **Response**:
>
> **Success (200)**:\
> json\
> Copy code\
> {\
> \"message\": \"Webhook received and processed successfully\" }
>
> ○
>
> **Error (400)**:\
> json\
> Copy code\
> {\
> \"error\": \"Invalid input: requestId, status are required\" }
>
> ○
>
> **Error (500)**:\
> json
>
> Copy code\
> {\
> \"error\": \"Internal server error\"\
> }\
> ○
>
> **Background Jobs**\
> **1. Image Processing**\
> ● The processImages function processes all images for products related
> to a specific requestId. It fetches the images, compresses them, and
> updates the product with the new image URLs in Cloudinary.

+-----------------------+-----------------------+-----------------------+
| ●                     | > **Status Values**:  |                       |
+=======================+=======================+=======================+
|                       | ○                     | > Pending: Image      |
|                       |                       | > processing has not  |
|                       |                       | > started.            |
+-----------------------+-----------------------+-----------------------+
|                       | ○                     | > Processing: Image   |
|                       |                       | > processing is in    |
|                       |                       | > progress.           |
+-----------------------+-----------------------+-----------------------+
|                       | ○                     | > Completed: Image    |
|                       |                       | > processing is       |
|                       |                       | > finished.           |
+-----------------------+-----------------------+-----------------------+

> **2. MongoDB Connection**\
> ● MongoDB is used to store the product data and its associated status.
> The application connects to the database using the MONGO_URI
> environment variable.
>
> **3. CSV Parsing**\
> ● The parseCSV utility is used to read and parse a CSV file and
> extract product information.
>
> **Error Handling**

+-----------------------+-----------------------+-----------------------+
| ●                     | > **General Errors**: |                       |
+=======================+=======================+=======================+
|                       | ○                     | > 400: Bad Request    |
|                       |                       | > (Invalid input)     |
+-----------------------+-----------------------+-----------------------+
|                       | ○                     | > 404: Not Found      |
|                       |                       | > (Resource not       |
|                       |                       | > found, e.g., no     |
|                       |                       | > records for         |
|                       |                       | > requestId)          |
+-----------------------+-----------------------+-----------------------+
|                       | ○                     | > 500: Internal       |
|                       |                       | > Server Error        |
|                       |                       | > (Unexpected server  |
|                       |                       | > errors)             |
+-----------------------+-----------------------+-----------------------+

> **Environment Variables**

+-----------------------------------+-----------------------------------+
| ●                                 | > MONGO_URI: MongoDB connection   |
|                                   | > string.                         |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

> **Dependencies**

+-----------------------------------+-----------------------------------+
| > ●\                              | > **express**: A fast,            |
| > ●\                              | > unopinionated web framework for |
| > ●\                              | > Node.js.                        |
| > ●\                              | >                                 |
| > ●\                              | > **dotenv**: Loads environment   |
| > ●\                              | > variables from a .env file.     |
| > ●\                              | >                                 |
| > ●                               | > **mongoose**: MongoDB object    |
|                                   | > modeling for Node.js.           |
|                                   | >                                 |
|                                   | > **sharp**: High-performance     |
|                                   | > image processing library.       |
|                                   | >                                 |
|                                   | > **node-fetch**: A lightweight   |
|                                   | > module for making HTTP          |
|                                   | > requests.                       |
|                                   | >                                 |
|                                   | > **csv-parser**: CSV file        |
|                                   | > parsing.                        |
|                                   | >                                 |
|                                   | > **multer**: Middleware for      |
|                                   | > handling multipart/form-data    |
|                                   | > (used for file uploads).        |
|                                   | > **uuid**: A package to generate |
|                                   | > unique IDs.                     |
+===================================+===================================+
+-----------------------------------+-----------------------------------+
