import type { Prisma } from '@prisma/client'

import { db } from '$api/src/lib/db'

export default async () => {
  try {
    const users = [
      {
        id: "a2b21ce1-ae57-43a2-b6a3-b6e542fd9e60",
        userName: "local-user-1",
        name: "local 1",
        email: "localUser1@kurthutten.com"
      },
      {
        id: "682ba807-d10e-4caf-bf28-74054e46c9ec",
        userName: "local-user-2",
        name: "local 2",
        email: "localUser2@kurthutten.com"
      },
      {
        id: "5cea3906-1e8e-4673-8f0d-89e6a963c096",
        userName: "local-admin-2",
        name: "local admin",
        email: "localAdmin@kurthutten.com"
      },
    ]

    let existing
    existing = await db.user.findMany({ where: { id: users[0].id }})
    if(!existing.length) {
      await db.user.create({
        data: users[0],
      })
    }
    existing = await db.user.findMany({ where: { id: users[1].id }})
    if(!existing.length) {
      await db.user.create({
        data: users[1],
      })
    }

    const projects = [
      {
        title: 'demo-project1',
        description: '# can be markdown',
        mainImage: 'CadHub/kjdlgjnu0xmwksia7xox',
        code: getOpenScadHingeCode(),
        cadPackage: 'openscad',
        user: {
          connect: {
            id: users[0].id,
          },
        },
      },
      {
        title: 'demo-project2',
        description: '## [hey](www.google.com)',
        user: {
          connect: {
            id: users[1].id,
          },
        },
      },
    ]

    existing = await db.project.findMany({where: { title: projects[0].title}})
    if(!existing.length) {
      await db.project.create({
        data: projects[0],
      })
    }
    existing = await db.project.findMany({where: { title: projects[1].title}})
    if(!existing.length) {
      const result = await db.project.create({
        data: projects[1],
      })

      await db.project.create({
        data: {
          ...projects[1],
          title: `${projects[1].title} fork`,
          forkedFrom: {
            connect: {
              id: result.id,
            },
          },
        },
      })
    }



    const aProject = await db.project.findUnique({where: {
      title_userId: {
        title: projects[0].title,
        userId: users[0].id,
      }
    }})
    await db.comment.create({
      data: {
        text: "nice project, I like it",
        userId: users[0].id,
        projectId: aProject.id,
        // user: {connect: { id: users[0].id}},
        // project: {connect: { id: aProject.id}},
      }
    })
    await db.projectReaction.create({
      data: {
        emote: "❤️",
        userId: users[0].id,
        projectId: aProject.id,
        // user: {connect: { id: users[0].id}},
        // project: {connect: { id: aProject.id}},
      }
    })

  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}


function getOpenScadHingeCode () {
  return `
baseWidth=15; // [0.1:0.1:50]

hingeLength=30; // [0.1:0.1:50]

// Hole mant mounting holes per half.
mountingHoleCount=3; // [1:20]

baseThickness=3; // [0.1:0.1:20]

pivotRadius=5; // [0.1:0.1:20]

// Pin that the hinge pivots on.
pinRadius=2; // [0.1:0.1:20]

mountingHoleRadius=1.5; // [0.1:0.1:10]

// How far away the hole is from the egde.
mountingHoleEdgeOffset=4; // [0:50]

// Depending on the accuracy of your printer this may need to be increased in order for print in place to work.
clearance=0.2; // [0.05:0.01:1]

// Radius difference in the ivot taper to stop the hinge from falling apart. Should be increased with large clearance values.
pinTaper=0.25; // [0.1:0.1:2]

// calculated values
hingeHalfExtrudeLength=hingeLength/2-clearance/2;
mountingHoleMoveIncrement=(hingeLength-2*mountingHoleEdgeOffset)/
  (mountingHoleCount-1);

module costomizerEnd() {}
$fn=30;
tiny=0.005;
// modules
module hingeBaseProfile() {
  translate([pivotRadius,0,0]){
    square([baseWidth,baseThickness]);
  }
}

module hingeBodyHalf() {
  difference() {
    union() {
      linear_extrude(hingeHalfExtrudeLength){
        offset(1)offset(-2)offset(1){
          translate([0,pivotRadius,0]){
            circle(pivotRadius);
          }
          square([pivotRadius,pivotRadius]);
          hingeBaseProfile();
        }
      }
      linear_extrude(hingeLength){
        offset(1)offset(-1)hingeBaseProfile();
      }
    }
    plateHoles();
  }
}

module pin(rotateY, radiusOffset) {
  translate([0,pivotRadius,hingeHalfExtrudeLength+tiny]){
    rotate([0,rotateY,0]) {
      cylinder(
        h=hingeLength/2+clearance/2,
        r1=pinRadius+radiusOffset,
        r2=pinRadius+pinTaper+radiusOffset
      );
    }
  }
}

module hingeHalfFemale() {
  difference() {
    hingeBodyHalf();
    pin(rotateY=180, radiusOffset=clearance);
  }
}

module hingeHalfMale() {
  translate([0,0,hingeLength]) {
    rotate([0,180,0]) {
      hingeBodyHalf();
      pin(rotateY=0, radiusOffset=0);
    }
  }
}

module plateHoles() {
  for(i=[0:mountingHoleCount-1]){
    translate([
      baseWidth/2+pivotRadius,
      -baseThickness,
      i*mountingHoleMoveIncrement+mountingHoleEdgeOffset
    ]){
      rotate([-90,0,0]){
        cylinder(r=mountingHoleRadius,h=baseThickness*4);
      }
    }
  }
}

// using high-level modules
translate([0,0,-15]) {
    hingeHalfFemale();
    hingeHalfMale();
}
  `
}
