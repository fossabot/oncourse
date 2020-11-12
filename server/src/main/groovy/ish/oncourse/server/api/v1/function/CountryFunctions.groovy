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

package ish.oncourse.server.api.v1.function

import ish.oncourse.server.api.v1.model.CountryDTO
import ish.oncourse.server.cayenne.Country

class CountryFunctions {

    static CountryDTO toRestCountry(Country dbCountry) {
        dbCountry ? new CountryDTO().with { country ->
            country.id = dbCountry.id
            country.name = dbCountry.name
            country
        } : null
    }
}
