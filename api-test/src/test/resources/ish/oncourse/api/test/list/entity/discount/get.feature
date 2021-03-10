@parallel=false
Feature: Main feature for all GET requests with path 'list/entity/discount'

    Background: Authorize first
        * call read('../../../signIn.feature')
        * url 'https://127.0.0.1:8182/a/v1'
        * def ishPath = 'list/entity/discount'
        * def ishPathLogin = 'login'
        * def ishPathList = 'list'
        * configure httpClientClass = 'ish.oncourse.api.test.client.KarateClient'



    Scenario: (+) Get list of all discounts by admin

        Given path ishPathList
        And param entity = 'Discount'
        When method GET
        Then status 200
        And match $.rows[*].id contains ["1001", "1002"]
        And match $.rows[*].values[2] contains ["discount2", "discount1"]



    Scenario: (+) Get list of all discounts by notadmin with access rights

#       <--->  Login as notadmin
        Given path '/logout'
        And request {}
        When method PUT
        * def loginBody = {login: 'UserWithRightsView', password: 'password', kickOut: 'true', skipTfa: 'true'}

        Given path '/login'
        And request loginBody
        When method PUT
        Then status 200
#       <--->

        Given path ishPathList
        And param entity = 'Discount'
        When method GET
        Then status 200
        And match $.rows[*].id contains ["1001", "1002"]
        And match $.rows[*].values[2] contains ["discount2", "discount1"]



    Scenario: (+) Get discount by admin

        Given path ishPath + '/1001'
        When method GET
        Then status 200
        And match $ ==
        """
        {
        "id":1001,
        "name":"discount1",
        "discountType":"Percent",
        "rounding":"No Rounding",
        "discountValue":null,
        "discountPercent":0.100,
        "discountMin":null,
        "discountMax":null,
        "cosAccount":10,
        "predictedStudentsPercentage":0.10,
        "availableOnWeb":true,
        "code":null,
        "validFrom":null,
        "validFromOffset":-30,
        "validTo":null,
        "validToOffset":5,
        "hideOnWeb":false,
        "description":null,
        "studentEnrolledWithinDays":null,
        "studentAgeUnder":null,
        "studentAge":null,
        "studentPostcode":null,
        "discountConcessionTypes":[],
        "discountMemberships":#ignore,
        "discountCourseClasses":
            [
            {"expiryDate":null,"entityToId":null,"code":"course1-3","entityFromId":null,"name":"Course1","active":true,"relationId":null,"id":3,"type":"Class"},
            {"expiryDate":null,"entityToId":null,"code":"course1-2","entityFromId":null,"name":"Course1","active":true,"relationId":null,"id":2,"type":"Class"}
            ],
        "addByDefault":false,
        "minEnrolments":1,
        "minValue":0.00,
        "corporatePassDiscounts":[{"contactFullName":"company #3","id":1009}],
        "createdOn":"#ignore",
        "modifiedOn":"#ignore",
        "limitPreviousEnrolment":false,
        "relationDiscount":null
        }
        """



    Scenario: (+) Get discount by notadmin with access rights

#       <--->  Login as notadmin
        Given path '/logout'
        And request {}
        When method PUT
        * def loginBody = {login: 'UserWithRightsView', password: 'password', kickOut: 'true', skipTfa: 'true'}

        Given path '/login'
        And request loginBody
        When method PUT
        Then status 200
#       <--->

        Given path ishPath + "/1002"
        When method GET
        Then status 200
        And match $ ==
        """
        {
        "id":1002,
        "name":"discount2",
        "discountType":"Percent",
        "rounding":"No Rounding",
        "discountValue":null,
        "discountPercent":0.200,
        "discountMin":null,
        "discountMax":null,
        "cosAccount":10,
        "predictedStudentsPercentage":0.10,
        "availableOnWeb":true,
        "code":null,
        "validFrom":null,
        "validFromOffset":null,
        "validTo":null,
        "validToOffset":null,
        "hideOnWeb":false,
        "description":null,
        "studentEnrolledWithinDays":null,
        "studentAgeUnder":null,
        "studentAge":null,
        "studentPostcode":null,
        "discountConcessionTypes":[],
        "discountMemberships":#ignore,
        "discountCourseClasses":
            [
            {"expiryDate":null,"entityToId":null,"code":"course1-3","entityFromId":null,"name":"Course1","active":true,"relationId":null,"id":3,"type":"Class"}
            ],
        "addByDefault":false,
        "minEnrolments":1,
        "minValue":0.00,
        "corporatePassDiscounts":[{"id":1001,"contactFullName":"company #1"}],
        "createdOn":"#ignore",
        "modifiedOn":"#ignore",
        "limitPreviousEnrolment":false,
        "relationDiscount":false
        }
        """



    Scenario: (-) Get list of all discounts by notadmin without access rights

#       <--->  Login as notadmin
        Given path '/logout'
        And request {}
        When method PUT
        * def loginBody = {login: 'UserWithRightsHide', password: 'password', kickOut: 'true', skipTfa: 'true'}

        Given path '/login'
        And request loginBody
        When method PUT
        Then status 200
#       <--->

        Given path ishPathList
        And param entity = 'Discount'
        When method GET
        Then status 403
        And match $.errorMessage == "Sorry, you have no permissions to view this entity. Please contact your administrator"



    Scenario: (-) Get discount by notadmin without access rights

#       <--->  Login as notadmin
        Given path '/logout'
        And request {}
        When method PUT
        * def loginBody = {login: 'UserWithRightsHide', password: 'password', kickOut: 'true', skipTfa: 'true'}

        Given path '/login'
        And request loginBody
        When method PUT
        Then status 200
#       <--->

        Given path ishPath + "/1001"
        When method GET
        Then status 403
        And match $.errorMessage == "Sorry, you have no permissions to get discount. Please contact your administrator"



    Scenario: (-) Get not existing discount

        Given path ishPath + "/9999"
        When method GET
        Then status 400
        And match $.errorMessage == "Discount with id:9999 doesn't exist"



    Scenario: (-) Get existing discount without id in path

        Given path ishPath
        When method GET
        Then status 405
