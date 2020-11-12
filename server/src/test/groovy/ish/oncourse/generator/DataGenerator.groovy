package ish.oncourse.generator


import ish.oncourse.server.cayenne.ApplicationFieldConfiguration
import ish.oncourse.server.cayenne.EnrolmentFieldConfiguration
import ish.oncourse.server.cayenne.FieldConfiguration
import ish.oncourse.server.cayenne.FieldConfigurationLink
import ish.oncourse.server.cayenne.FieldConfigurationScheme
import ish.oncourse.server.cayenne.WaitingListFieldConfiguration
import org.apache.cayenne.ObjectContext

class DataGenerator {
    
    private ObjectContext context
    
    private DataGenerator() {
        
    }
    
    static DataGenerator valueOf(ObjectContext context) {
        DataGenerator generator = new DataGenerator()
        generator.context = context
        generator
    }
    
    FieldConfigurationScheme getFieldConfigurationScheme() {
        FieldConfigurationScheme scheme = context.newObject(FieldConfigurationScheme)
        scheme.name = 'test field configuration scheme'
        
        addFieldConfiguration(scheme, ApplicationFieldConfiguration)
        addFieldConfiguration(scheme, WaitingListFieldConfiguration)
        addFieldConfiguration(scheme, EnrolmentFieldConfiguration)
        scheme
    }
    
    FieldConfiguration getFieldConfiguration(Class<? extends FieldConfiguration> aClass) {
        FieldConfiguration configuration = context.newObject(aClass)
        configuration.name = 'test configuration'
        configuration
    }

    private void addFieldConfiguration(FieldConfigurationScheme scheme, Class<? extends FieldConfiguration> aClass) {
        FieldConfiguration configuration = getFieldConfiguration(aClass)
        FieldConfigurationLink link = context.newObject(FieldConfigurationLink)
        link.setFieldConfiguration(configuration)
        link.setFieldConfigurationScheme(scheme)
    }
    
}
