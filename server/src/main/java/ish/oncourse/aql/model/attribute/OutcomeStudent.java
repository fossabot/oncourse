/*
 * Copyright ish group pty ltd 2020.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 */

package ish.oncourse.aql.model.attribute;

import ish.oncourse.aql.model.Entity;
import ish.oncourse.aql.model.EntityFactory;
import ish.oncourse.aql.model.SyntheticAttributeDescriptor;
import ish.oncourse.server.cayenne.Enrolment;
import ish.oncourse.server.cayenne.Outcome;
import ish.oncourse.server.cayenne.PriorLearning;
import ish.oncourse.server.cayenne.Student;
import org.apache.cayenne.Persistent;
import org.apache.cayenne.exp.parser.SimpleNode;

import java.util.Optional;

public class OutcomeStudent implements SyntheticAttributeDescriptor {

    private final EntityFactory factory;

    public OutcomeStudent(EntityFactory factory) {
        this.factory = factory;
    }

    @Override
    public Class<? extends Persistent> getEntityType() {
        return Outcome.class;
    }

    @Override
    public String getAttributeName() {
        return "contact";
    }

    @Override
    public Optional<Entity> nextEntity() {
        return Optional.of(factory.createEntity(Student.class));
    }

    @Override
    public SimpleNode spawnNode() {
        return new SyntheticCompoundNodeTemplate(getAttributeName(),
                Outcome.ENROLMENT.outer()
                        .dot(Enrolment.STUDENT).outer()
                        .dot(Student.CONTACT).outer()
                        .getExpression(),
                Outcome.PRIOR_LEARNING.outer()
                        .dot(PriorLearning.STUDENT).outer()
                        .dot(Student.CONTACT).outer()
                        .getExpression());
    }
}
