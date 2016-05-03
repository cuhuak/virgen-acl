var PermissionList = function(permissions, role, resource, action, done, sync) {
  this.permissions = permissions;
  this.role = role;
  this.resource = resource;
  this.action = action;
  this.done = done;
  this.position = 0;
  this.count = this.permissions.length;
  this.sync = sync;
};

PermissionList.prototype.next = function() {
  if (this.count == this.position) {
    return this.done(null, false); // No more permissions to check, DENIED!!1
  }

  var permission = this.permissions[this.position];

  if (this.sync) {
    permission.query(
      this.role,
      this.resource,
      this.action,
      this.done,
      this.next.bind(this)
    );

    this.position++;
  }
  else {
    // Ensure custom assertions are run async, fixes issue #7
    setTimeout(function() {
      permission.query(
        this.role,
        this.resource,
        this.action,
        this.done,
        this.next.bind(this)
      );
    }.bind(this));

    this.position++;
  }
};

module.exports = PermissionList;
