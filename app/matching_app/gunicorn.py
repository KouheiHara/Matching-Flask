import os
import multiprocessing

# unix domain socket
socket_path = 'unix:/tmp/gunicorn_socket/gunicorn_flask.sock'
# tcp socket
#socket_path = '0.0.0.0:9876'
bind = socket_path

# Debugging
reload = True

# Logging
loglevel = 'info'
#loglevel = 'debug'

accesslog = '-'
errorlog = '-'

capture_output = True

# Proc Name
proc_name = 'Infrastructure-Practice-Flask'

# Worker Processes
workers = (int(multiprocessing.cpu_count()) *2) +1
threads = (int(multiprocessing.cpu_count()) *2) +1
worker_class = 'gthread'