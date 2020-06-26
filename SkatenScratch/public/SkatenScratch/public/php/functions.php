<?php
session_start();

/*Error Code List
0 - Invalid Email Address
1 - Email address has already claimed coupon
2 - Coudn't add customer and coupon code to AirTable
3 - Multiple attempts
*/

//Include the Airtable PHP Wrapper
include('airtable/Airtable.php');
include('airtable/Request.php');
include('airtable/Response.php');

//Add the API Key Credentials
use \TANIOS\Airtable\Airtable;

//Function to choose the discount for the user
function getRandomDiscount() {
    $discountsArray = array(
        array("HEALTHYNAMKEEN10", "You get 10% Off on your entire order!"),
        array("NAMKEEN10", "You get 10% Off on your entire order!"),
        array("SNACKONBAKED10", "You get 10% Off on your entire order!"),
        array("RAGISNACKS15", "You get 15% Off on your order over Rs. 500!"),
        array("HEALTHYBITE15", "You get 15% Off on your order over Rs. 500!"),
        array("MILLET15", "You get 15% Off on your order over Rs. 500!"),
        array("BAKED20", "You get 20% Off on your order over Rs. 750!"),
        array("NOMAIDA100", "You get Rs. 100 Off on your order over Rs. 750!"),
        array("NAMKEENTWIST75", "You get Rs. 75 Off on your order over Rs. 750!"),
        array("GOODBITES50", "You get Rs. 50 Off on your order over Rs. 500!"),
        );
    
    $noOfDiscounts = sizeof($discountsArray);
    $randomNumer = rand(0, $noOfDiscounts - 1);
        
    return $discountsArray[$randomNumer];
}

//Function to register the email ID if user exists
function registerEmailID($emailID) {
    if(filter_var($emailID, FILTER_VALIDATE_EMAIL)) {
        if($_SESSION["isCodeGenerated"] == "false") {
            $_SESSION["isCodeGenerated"] = "true";
            $discountCodeArray = getRandomDiscount();

            if(checkIfUserHasCode($emailID, $discountCodeArray) == 0) {
                //Customer doesn't have this coupon
                $newCustomerID = addCustomerToCoupon($emailID, $discountCodeArray);
                if($newCustomerID != '')
                    echo json_encode($discountCodeArray);
                else {
                    $_SESSION["isCodeGenerated"] = "false";
                    echo "2";
                }
            } else {
                //Customer has this coupon
                $_SESSION["isCodeGenerated"] = "false";
                echo "1";
            }
        } else 
            echo "3";
    } else {
        //Invalid Email Address
        $_SESSION["isCodeGenerated"] = "false";
        echo "0";
    }
}

function checkIfUserHasCode($emailID, $discountCodeArray) {
    //Declare the variables
    $airTableSheetName = 'registrations';
    $airTableApiKey = 'keyuue9WpnnNThPtQ';
    $airTableBase = 'app5uamszdP3mn4nD';

    $airtable = new Airtable(array(
        'api_key' => $airTableApiKey,
        'base'    => $airTableBase
    ));
    
    //Create the parameters for the request
    $params = array(
        "filterByFormula" => "AND(couponcode = '".$discountCodeArray[0]."', email = '".$emailID."')",
    );
    $request = $airtable->getContent($airTableSheetName, $params);
    $response = $request->getResponse();
    
    return count($response['records']);
}

//Function to add user to the discount code
function addCustomerToCoupon($emailID, $discountCodeArray) {
    //Declare the variables
    $airTableSheetName = 'registrations';
    $airTableApiKey = 'keyuue9WpnnNThPtQ';
    $airTableBase = 'app5uamszdP3mn4nD';

    $airtable = new Airtable(array(
        'api_key' => $airTableApiKey,
        'base'    => $airTableBase
    ));
    
    $customerArray = array(
        'email' => $emailID,
        'couponcode' => $discountCodeArray[0]
    );

    //Save to Airtable
    $newCustomer = $airtable->saveContent($airTableSheetName, $customerArray);

    //The ID of the new entry
    return $newCustomer->id;
}
?>
