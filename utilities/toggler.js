let currentAccess = req.query.currentAccess;
  if (currentAccess == "true") {
    currentAccess = currentAccess ? false : true;
  } else if (currentAccess == "false") {
    currentAccess = currentAccess ? true : false;
  }
  currentAccess = Boolean(currentAccess);