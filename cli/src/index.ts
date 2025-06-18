const exit = () => process.exit(0)
process.on('SIGINT', exit)
process.on('SIGTERM', exit)
