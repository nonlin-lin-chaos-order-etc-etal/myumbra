export function get_required_env_var(varname: string, varvalue: string|undefined): string {
  //const varvalue = eval(`process.env.$varname`);
  console.log(`${varname}: ${String(varvalue)} (required)`);
  if (!varvalue) {
    const errmsg = `Please specify a required .env var '${varname}'.`;
    console.error(errmsg);
    throw errmsg;
  }
  return varvalue;
}


export function get_optional_env_var(varname: string, varvalue: string|undefined): string|undefined {
  //const varvalue = process.env[varname];
  console.log(`${varname}: ${String(varvalue)} (optional)`);
  if (!varvalue) {
    const errmsg = `Warning: you can specify an optional .env var '${varname}'.`;
    console.log(errmsg);
  }
  return varvalue;
}


