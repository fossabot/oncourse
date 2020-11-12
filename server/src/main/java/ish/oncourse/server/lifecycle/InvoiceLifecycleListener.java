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
package ish.oncourse.server.lifecycle;

import ish.oncourse.server.cayenne.Account;
import ish.oncourse.server.cayenne.Invoice;
import ish.util.AccountUtil;
import org.apache.cayenne.annotation.PostAdd;


/**
 */
public class InvoiceLifecycleListener {


    @PostAdd(value = Invoice.class)
    public void postAdd(Invoice entity) {
        var aContext = entity.getContext();
        entity.setDebtorsAccount(AccountUtil.getDefaultDebtorsAccount(aContext, Account.class));
        if (entity.getAllowAutoPay() == null) {
            entity.setAllowAutoPay(false);
        }
    }
    
}
