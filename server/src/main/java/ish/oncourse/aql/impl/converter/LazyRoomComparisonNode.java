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

package ish.oncourse.aql.impl.converter;

import ish.oncourse.aql.impl.Op;
import org.apache.cayenne.exp.parser.ASTObjPath;
import org.apache.cayenne.exp.parser.ASTScalar;
import org.apache.cayenne.exp.parser.SimpleNode;

public class LazyRoomComparisonNode extends LazyEntityComparisonNode {

    LazyRoomComparisonNode(Op op) {
        super(op);
    }

    @Override
    protected SimpleNode createNode() {
        var pathString = ((ASTObjPath)this.jjtGetChild(0)).getPath();
        if(!pathString.isEmpty()) {
            pathString += '.';
        }
        var value = new NameValue(((ASTScalar)this.jjtGetChild(1)).getValue().toString(), getOp());
        return createComparisionNode(pathString + "name", value.getRoomName());
    }

    private static class NameValue {

        private final Op op;
        private String roomName;

        private NameValue(String nameString, Op op) {
            this.op = op;
            roomName = nameString.replaceAll("%", "");
        }

        private String getRoomName() {
            if ((op == Op.EQ) || (op == Op.NE)) {
                return roomName;
            }
            return roomName == null ? null : roomName + "%";
        }
    }
}
