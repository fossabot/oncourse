@parallel=false
Feature: Main feature for all POST requests with path 'list/entity/courseClass/tutor'

    Background: Authorize first
        * call read('../../../../signIn.feature')
        * url 'https://127.0.0.1:8182/a/v1'
        * def ishPath = 'list/entity/courseClass/tutor'
        * def ishPathLogin = 'login'
        * def ishPathList = 'list'
        * configure httpClientClass = 'ish.oncourse.api.test.client.KarateClient'



    Scenario: (+) Create Tutor by admin

        * def newTutor =
            """
            {
            "classId":6,
            "contactId":5,
            "roleId":1,
            "confirmedOn":"2018-01-01",
            "isInPublicity":true
            }
            """

        Given path ishPath
        And request newTutor
        When method POST
        Then status 200

        Given path ishPath + '/6'
        When method GET
        Then status 200

        * def id = get[0] response[?(@.contactId == 5)].id
        * print "id = " + id

#       <---> Verification:
        Given path ishPath + '/6'
        When method GET
        Then status 200
        And match $ ==
            """
            [
              {"id":6,"classId":6,"contactId":6,"roleId":5,"tutorName":"tutor3","roleName":"Helper","confirmedOn":null,"isInPublicity":true},
              {"id":"#(~~id)","classId":6,"contactId":5,"roleId":1,"tutorName":"tutor2","roleName":"Lecturer","confirmedOn":"2018-01-01","isInPublicity":true}
            ]
            """
#       <--->  Scenario have been finished. Now remove created object from DB:
        Given path ishPath + '/' + id
        When method DELETE
        Then status 204



    Scenario: (+) Create Tutor by notadmin with access rights

#       <--->  Login as notadmin
        Given path '/logout'
        And request {}
        When method PUT
        * def loginBody = {login: 'UserWithRightsEdit', password: 'password', kickOut: 'true', skipTfa: 'true'}

        Given path '/login'
        And request loginBody
        When method PUT
        Then status 200
#       <--->

        * def newTutor =
            """
            {
            "classId":6,
            "contactId":5,
            "roleId":1,
            "confirmedOn":null,
            "isInPublicity":false
            }
            """

        Given path ishPath
        And request newTutor
        When method POST
        Then status 200

        Given path ishPath + '/6'
        When method GET
        Then status 200

        * def id = get[0] response[?(@.contactId == 5)].id
        * print "id = " + id

#       <---> Verification:
        Given path ishPath + '/6'
        When method GET
        Then status 200
        And match $ ==
            """
            [
              {"id":6,"classId":6,"contactId":6,"roleId":5,"tutorName":"tutor3","roleName":"Helper","confirmedOn":null,"isInPublicity":true},
              {"id":"#(~~id)","classId":6,"contactId":5,"roleId":1,"tutorName":"tutor2","roleName":"Lecturer","confirmedOn":null,"isInPublicity":false}
            ]
            """
#       <--->  Scenario have been finished. Now remove created object from DB:
        * def loginBody = {login: 'admin', password: 'password', kickOut: 'true', skipTfa: 'true'}

        Given path '/login'
        And request loginBody
        When method PUT
        Then status 200

        Given path ishPath + '/' + id
        When method DELETE
        Then status 204



    Scenario: (+) Create Tutor by notadmin without access rights

#       <--->  Login as notadmin
        Given path '/logout'
        And request {}
        When method PUT
        * def loginBody = {login: 'UserWithRightsPrint', password: 'password', kickOut: 'true', skipTfa: 'true'}

        Given path '/login'
        And request loginBody
        When method PUT
        Then status 200
#       <--->

        * def newTutor =
            """
            {
            "classId":6,
            "contactId":5,
            "roleId":1,
            "confirmedOn":null,
            "isInPublicity":false
            }
            """

        Given path ishPath
        And request newTutor
        When method POST
        Then status 403
        And match $.errorMessage == "Sorry, you have no permissions to create course class tutors. Please contact your administrator"



    Scenario: (-) Create Tutor arleady assigned to class

#       <---> Create record and get its id:
        * def newTutor =
            """
            {
            "classId":6,
            "contactId":5,
            "roleId":1,
            "confirmedOn":null,
            "isInPublicity":false
            }
            """

        Given path ishPath
        And request newTutor
        When method POST
        Then status 200

        Given path ishPath + '/6'
        When method GET
        Then status 200

        * def id = get[0] response[?(@.contactId == 5)].id
        * print "id = " + id
#       <--->

        Given path ishPath
        And request newTutor
        When method POST
        Then status 400
        And match $.errorMessage == "Tutor arleady assigned to class as: Lecturer"

#       <--->  Scenario have been finished. Now remove created object from DB:
        Given path ishPath + '/' + id
        When method DELETE
        Then status 204



    Scenario: (-) Create Tutor for not existing class

        * def newTutor =
            """
            {
            "classId":99999,
            "contactId":5,
            "roleId":1,
            "confirmedOn":null,
            "isInPublicity":false
            }
            """

        Given path ishPath
        And request newTutor
        When method POST
        Then status 400
        And match $.errorMessage == "Class is wrong"



    Scenario: (-) Create Tutor for not existing contact

        * def newTutor =
            """
            {
            "classId":6,
            "contactId":99999,
            "roleId":1,
            "confirmedOn":null,
            "isInPublicity":false
            }
            """

        Given path ishPath
        And request newTutor
        When method POST
        Then status 400
        And match $.errorMessage == "Tutor is wrong"



    Scenario: (-) Create Tutor for with existing role

        * def newTutor =
            """
            {
            "classId":6,
            "contactId":5,
            "roleId":99999,
            "confirmedOn":null,
            "isInPublicity":false
            }
            """

        Given path ishPath
        And request newTutor
        When method POST
        Then status 400
        And match $.errorMessage == "Defined tutor role is wrong"