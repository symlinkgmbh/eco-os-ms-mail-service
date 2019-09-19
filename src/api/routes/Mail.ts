/**
 * Copyright 2018-2019 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */



import { MsMail, PkApi } from "@symlinkde/eco-os-pk-models";
import { AbstractRoutes, injectValidatorService } from "@symlinkde/eco-os-pk-api";
import { Application, Request, Response, NextFunction } from "express";
import { MailController } from "../controllers/MailController";

@injectValidatorService
export class MailRoute extends AbstractRoutes implements PkApi.IRoute {
  private mailController: MailController = MailController.getInstance();
  private validatorService!: PkApi.IValidator;
  private postAccountLockedPattern: PkApi.IValidatorPattern = {
    to: "",
    unlockDate: "",
    appURL: "",
    webURL: "",
  };
  private postResetPasswordPattern: PkApi.IValidatorPattern = {
    to: "",
    otp: "",
    forgotPasswordId: "",
    appURL: "",
    webURL: "",
  };
  private postDeleteAccountPattern: PkApi.IValidatorPattern = {
    to: "",
    deleteId: "",
    appURL: "",
    webURL: "",
  };
  private postActivateAccountPattern: PkApi.IValidatorPattern = {
    to: "",
    activationId: "",
    appURL: "",
    webURL: "",
  };
  private postChangePasswordPattern: PkApi.IValidatorPattern = {
    to: "",
    otp: "",
    forgotPasswordId: "",
    appURL: "",
    webURL: "",
  };

  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.accountLockedMail();
    this.activateAccountMail();
    this.accountDeleteMail();
    this.resetPasswordMail();
    this.changePasswordMail();
  }

  private accountLockedMail(): void {
    this.getApp()
      .route("/mail/account/locked")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postAccountLockedPattern);
        this.mailController
          .sendAccountLockedMail(req.body as MsMail.IMailAccountLocked)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private activateAccountMail(): void {
    this.getApp()
      .route("/mail/account/activate")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postActivateAccountPattern);
        this.mailController
          .sendActivateAccountMail(req.body as MsMail.IMailActivateAccount)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private accountDeleteMail(): void {
    this.getApp()
      .route("/mail/account/delete")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postDeleteAccountPattern);
        this.mailController
          .sendAccountDeleteMail(req.body as MsMail.IMailDeleteAccount)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private resetPasswordMail(): void {
    this.getApp()
      .route("/mail/account/password")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postResetPasswordPattern);
        this.mailController
          .sendResetPasswordMail(req.body as MsMail.IMailResetPassword)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private changePasswordMail(): void {
    this.getApp()
      .route("/mail/account/change")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postChangePasswordPattern);
        this.mailController
          .sendChangePasswordMail(req.body as MsMail.IMailResetPassword)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
