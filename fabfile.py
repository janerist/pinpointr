from fabric.api import env, settings, cd, run, sudo, prefix
from contextlib import contextmanager

env.user = 'janerist'
env.hosts = ['janerist.net']

REPO = 'http://github.com/janerist/pinpointr.git'
APP_DIR = '/home/janerist/apps/pinpointr'

def deploy():
    sync_changes()
    with cd(APP_DIR):
        run("mix deps.get --only prod")
        run("MIX_ENV=prod mix compile")
        run("MIX_ENV=prod mix ecto.migrate")
        run("brunch build")
        run("MIX_ENV=prod mix phoenix.digest")

    sudo('supervisorctl restart pinpointr')


def sync_changes():
    with settings(warn_only=True):
        app_exists = not run('test -d %s' % APP_DIR).failed

    if not app_exists:
        run('git clone %s %s' % (REPO, APP_DIR))
    else:
        with cd(APP_DIR):
            run('git pull')
