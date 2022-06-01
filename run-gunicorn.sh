#!/bin/bash

gunicorn -c conf/gunicorn_config.py website.wsgi --daemon
