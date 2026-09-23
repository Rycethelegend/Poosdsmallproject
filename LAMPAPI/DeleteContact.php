<?php

    $inData = getRequestInfo();

    $contactId = $inData["contactId"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "Poosdbase"); 

    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?"); 
        $stmt->bind_param("ii", $contactId, $userId);
        $stmt->execute();

        if ($stmt->affected_rows > 0)
        {
            returnWithError("");
        }
        else
        {
            returnWithError("Contact not found or access denied.");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

?>
