import walkoff.appgateway


def modified_setup_worker_env():
    import tests.config
    import walkoff.config.config
    import walkoff.appbase
    walkoff.appgateway.cache_apps(tests.config.test_apps_path)
    walkoff.config.config.load_app_apis(apps_path=tests.config.test_apps_path)
