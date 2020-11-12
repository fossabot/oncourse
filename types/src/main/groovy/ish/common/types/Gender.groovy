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

package ish.common.types

import ish.common.util.DisplayableExtendedEnumeration
import ish.oncourse.API

@API
enum Gender implements DisplayableExtendedEnumeration<Integer> {

    /**
     * Database value: 0
     */
    @API
    FEMALE(0, "Female"),

    /**
     * Database value: 1
     */
    @API
    MALE(1, "Male"),

    /**
     * Database value: 2
     */
    @API
    OTHER_GENDER(2, "Other")


    private String displayName
    private int value

    private Gender(int value, String displayName) {
        this.value = value
        this.displayName = displayName
    }

    @Override
    Integer getDatabaseValue() {
        return this.value
    }

    @Override
    String getDisplayName() {
        return this.displayName
    }

    @Override
    String toString() {
        return getDisplayName()
    }
}
