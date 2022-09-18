import { User } from "src/@core/models/user.model";

export class RegisterModel extends User {
  setModel(_model: unknown) {
    const model = _model as RegisterModel;
    this.fullName = model.fullName || '';
    this.email = model.email || '';
    this.username = model.username || '';
    this.password = model.password || '';
    this.avatar = [
      {
        "captureFileURL": '',
        "blurHash": ''
      }
    ];
    this.deletedCheck = model.deletedCheck || false;
    this.isAdmin = model.isAdmin || false;
  }
}
