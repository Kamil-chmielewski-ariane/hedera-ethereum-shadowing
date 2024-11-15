module.exports = {
    apps : [{
        name   : "hedera-shadowing",
        script : "pnpm",
        error_file  : "./logs/hedera-shadowing-errors-full.log",
        out_file : "./logs/hedera-shadowing-out-full.log",
        log_date_format: "YYYY-MM-DD HH:mm",
        max_memory_restart: '2G',
        autorestart: false,
        interpreter: "none",
        args: "ts-node -r tsconfig-paths/register src/apps/shadowing/index.ts",
    }]
}
