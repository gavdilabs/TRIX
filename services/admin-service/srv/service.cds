@requires: 'authenticated-user'
service TrixAdminService {

  // NOTE: TimeUser or similar grants access to read certain solution critical fields
  // NOTE: SolutionManagement grants access to configure solution
  // NOTE: SolutionAdmin grants all access

  function ping(msg : String null) returns String;

}
