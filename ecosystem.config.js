module.exports = {
    apps : [{
        name   : "hedera-shadowing",
        script : "./src/apps/shadowing/index.ts",
        error_file  : "./logs/hedera-shadowing-errors-full.log",
        out_file : "./logs/hedera-shadowing-out-full.log",
        log_date_format: "YYYY-MM-DD HH:mm",
        max_memory_restart: '2G',
        autorestart: false,
        log_date_format: "YYYY-MM-DD HH:mm"
    }]
}