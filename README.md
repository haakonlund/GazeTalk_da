# Running and installing Gazetalk
To install dependencies for the site run
```bash
npm install
```

### Running

To run Gazetalk website run at root
```bash
npm run dev -- --host
```
Then, navigate to the address displayed in your terminal (usually something like `http://localhost:5173` or your network IP if accessed remotely).
# Data collection server
Navigate to ````Gazetalk/server```

To install the python dependencies run :
```bash
pip install flask flask-cors
```

To run the data collection server run
```bash
python server.py 
# or
python3 server.py
```

if there is trouble running the python data collection server try to use ``python3 ``
If you are on a linux envioment and want to run it in the background you can use ``nohup``
```bash
apt install nohup
nohup python server.py &
```

The files will be saved in the folder ``json_data/``
