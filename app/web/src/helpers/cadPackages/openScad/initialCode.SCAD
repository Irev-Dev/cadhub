// involute donut

// ^ first comment is used for download title (i.e "involute-donut.stl")

// Follow the OpenSCAD tutorial: https://learn.cadhub.xyz/docs/

radius=3;
color(c="DarkGoldenrod")rotate_extrude()translate([20,0])circle(d=30);
color(c="hotpink")rotate_extrude()translate([20,0])offset(radius)offset(-radius)difference(){
    circle(d=34);
    translate([-200,-500])square([500,500]);
}