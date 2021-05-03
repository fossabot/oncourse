/**
 * Copyright ish group pty ltd. All rights reserved. http://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */
package ish.oncourse.server.cayenne


import groovy.transform.CompileStatic
import ish.CayenneIshTestCase
import ish.math.Money
import ish.oncourse.server.ICayenneService
import ish.oncourse.server.PreferenceController
import org.apache.cayenne.access.DataContext
import org.apache.cayenne.exp.ExpressionFactory
import org.apache.cayenne.query.SelectQuery
import org.apache.logging.log4j.LogManager
import org.apache.logging.log4j.Logger
import org.dbunit.dataset.ReplacementDataSet
import org.dbunit.dataset.xml.FlatXmlDataSet
import org.dbunit.dataset.xml.FlatXmlDataSetBuilder
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

@CompileStatic
class DiscountTest extends CayenneIshTestCase {
    private static final Logger logger = LogManager.getLogger()

    private ICayenneService cayenneService

    
    @BeforeEach
    void setup() throws Exception {
        wipeTables()

        this.cayenneService = injector.getInstance(ICayenneService.class)
        PreferenceController pref = injector.getInstance(PreferenceController.class)

        InputStream st = DiscountTest.class.getClassLoader().getResourceAsStream("ish/oncourse/server/testDataset.xml")
        FlatXmlDataSet dataSet = new FlatXmlDataSetBuilder().build(st)

        ReplacementDataSet replacementDataSet = new ReplacementDataSet(dataSet)
        replacementDataSet.addReplacementObject("[null]", null)

        executeDatabaseOperation(replacementDataSet)

    }

    
    @Test
    void testIsStudentEligible() throws Exception {

        DataContext context = this.cayenneService.getNewContext()
        List<Discount> discounts = context.select(SelectQuery.query(Discount.class))
        List<Student> students = context.select(SelectQuery.query(Student.class))
        context.select(SelectQuery.query(CourseClass.class))

        // trios of studentId - discountId - successExpected
        Long[][] expectedResults = [
                [1L, 1L, 1L],
                [1L, 2L, 0L],
                [2L, 2L, 0L],
                [3L, 2L, 1L],
                [4L, 2L, 0L],
                [5L, 1L, 1L],
                [5L, 2L, 0L],
                [6L, 2L, 0L],
                [7L, 2L, 1L],
                [8L, 2L, 0L]] as Long[][]

        for (Long[] expectedResult1 : expectedResults) {
            Student s = Student.ID.eq(expectedResult1[0]).filterObjects(students).get(0)
            Discount d = Discount.ID.eq(expectedResult1[1]).filterObjects(discounts).get(0)
            Boolean expectedResult = expectedResult1[2] == 1L
            Assertions.assertEquals(expectedResult,
                    d.isStudentEligibile(s.contact, [], null, 1, Money.ONE),
                    "Student : " + s.getId() + ", discount: " + d.getId())
        }

    }

    
    @Test
    void testIsClassEligible() throws Exception {

        DataContext context = this.cayenneService.getNewContext()
        List<Discount> discounts = context.select(SelectQuery.query(Discount.class))
        List<CourseClass> classes = context.select(SelectQuery.query(CourseClass.class))
        context.select(SelectQuery.query(CourseClass.class))

        // trios of courseClassId - discountId - successExpected
        Long[][] expectedResults = [
                [1L, 5L, 1L],
                [2L, 5L, 1L],
                [1L, 1L, 0L],
                [1L, 3L, 0L],
                [1L, 4L, 1L],
                [1L, 6L, 0L]] as Long[][]

        for (Long[] expectedResult1 : expectedResults) {
            CourseClass cc = ExpressionFactory.matchExp(CourseClass.ID_PROPERTY, expectedResult1[0]).filterObjects(classes).get(0)
            Discount d = ExpressionFactory.matchExp(Discount.ID_PROPERTY, expectedResult1[1]).filterObjects(discounts).get(0)
            Boolean expectedResult = expectedResult1[2] == 1L
            Assertions.assertEquals(expectedResult, Discount.getApplicableDiscounts(cc).contains(d), "CourseClass : " + cc.getId() + ", discount: " + d.getId())
        }

    }
}