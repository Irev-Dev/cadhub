

```bash
docker build . -t openscadendpoint

docker run -p 8080:8080 openscadendpoint

```

local commands
```bash
/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD -o output.png --imgsize=500,500 ./main.scad
```