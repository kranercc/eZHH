'''
    READ servers.txt
    output:
    x.x.x.x:user:pass
'''
import paramiko
import sys 

servers = {}
with open('servers.txt', 'r') as f:
    for line in f:
        ip = line.split(':')[0]
        user = line.split(':')[1]
        passwd = line.split(':')[2]
        passwd = passwd.strip()
        servers[ip] ={'user': user, 'passwd': passwd}


#execute command in server 
def execute_command(ip, user, passwd, command):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(ip, username=user, password=passwd)
    stdin, stdout, stderr = ssh.exec_command(command)
    result = stdout.read()
    ssh.close()
    print(result)
    return result

'''
sys.argv[1] = ip
sys.argv[2+] = command
'''
command = ' '.join(sys.argv[2:])
execute_command(sys.argv[1], servers[sys.argv[1]]['user'], servers[sys.argv[1]]['passwd'], command)