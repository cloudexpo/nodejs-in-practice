console.log("arch: ", process.arch);
console.log("platform: ", process.platform);
console.log("argv: ", process.argv);
console.log("PID", process.pid);

// console.log("stdin", process.stdin);

// console.log("stdout: ", process.stdout);

// console.log("stderr: ", process.stderr);


// process.exit(0)//specifiy return code of your node script
module.exports = process;
