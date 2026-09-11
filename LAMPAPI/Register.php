



<?php

    /*

    For Swagger Documentation, see below:

    /Register.php:
        post:
        tags:
            - Users
        summary: Register's a new user into Contact Manager
        operationId: doRegister
        description: Registers a user into Contact Manager
        consumes:
            - application/json
        produces:
            - application/json
        parameters:
            - in: body
            name: registerItem
            description: Register
            schema:
                $ref: '#/definitions/Register'
        responses:
            '200':
            description: OK
            '404':
            description: URL Not Found
            '500':
            description: Server Error

    definitions:

    Register:
        type: object
        required:
        - login
        - password
        properties:
        login:
            type: string
            example: fred
        password:
            type: string
            example: secret





    */




    #Register.php


    #get input data from request
    $inData = getRequestInfo();

    $id = 0;
	$firstName = "";
	$lastName = "";


    #Attempt to connect to database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "Poosdbase"); 	

	if( $conn->connect_error )
	{
        #if issue connecting to database, return error with Json
		returnWithError( $conn->connect_error );
	}
    else
    {
        #attempt to find user in database
        $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=?");
		$stmt->bind_param("ss", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

        #Attempt to get user info from database, if not found, then add user to database.
        if( $row = $result->fetch_assoc()  )
		{
			returnWithError("Existing User, please login");
		}
		else
		{
            #New addes User to Database if not found, return user info as Json
            $stmt = $conn->prepare("INSERT INTO Users (Login, Password, firstName, lastName) VALUES(?,?,?,?)");
            $stmt->bind_param("ssss", $inData["login"], md5($inData["password"]), $inData["firstName"], $inData["lastName"]);
            $stmt->execute();
            returnWithInfo( $inData["firstName"], $inData["lastName"], $conn->insert_id );
		}

        #done with database, close connection
		$stmt->close();
		$conn->close();




    }

        


    #if not found / no data found, return error with Json


    #-------------------------
    #Functions
    #-------------------------


    #get input data from request
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    #Return selected data as Json
    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	

    #Error message to return as Json
    function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    #returns user info as Json
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}



?>