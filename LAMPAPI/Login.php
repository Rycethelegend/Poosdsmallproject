<?php

    #get input data from request
    $inData = getRequestInfo();

    $id = 0;
	$firstName = "";
	$lastName = "";


    #Attempt to connect to database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	

	if( $conn->connect_error )
	{
        #if issue connecting to database, return error with Json
		returnWithError( $conn->connect_error );
	}
    else
    {
        #attempt to find user in database and login, return Json
        $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

        #Attempt to get user info from database, if found return info, else return error with Json
        if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
		else
		{
			returnWithError("No Records Found");
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