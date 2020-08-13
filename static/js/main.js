var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Events = Matter.Events,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
    world = engine.world;

var canvas = document.getElementById('canvas')

var screen_bottom = window.innerHeight * 0.95;

var screen_right_side = window.innerWidth * 0.95;

// create a renderer
var render = Render.create({
    element: canvas,
    engine: engine,
    options: {
        width: screen_right_side,
        height: screen_bottom,
        pixelRatio: 1,
        background: '#18181d',
        wireframeBackground: '#0f0f13',
        enabled: true,
        wireframes: false,
        showSleeping: true,
        showDebug: false,
        showBroadphase: true,
        showBounds: true,
        showVelocity: false,
        showCollisions: false,
        showSeparations: true,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: true,
        showMousePosition: false
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

console.log(render.bounds)

var centerX = (Math.abs(render.bounds.min.x) + render.bounds.max.x) / 2

console.log(centerX)

var centerY = (render.bounds.max.y + Math.abs(render.bounds.min.y)) / 2;

// add bodies
var ground = Bodies.rectangle(centerX, render.bounds.max.y, centerX * 2, 20, { isStatic: true }),
    leftWall = Bodies.rectangle(render.bounds.min.x, centerY, 20, (centerY * 2), { isStatic: true }),
    rightWall = Bodies.rectangle(render.bounds.max.x, centerY, 20, (centerY * 2), { isStatic: true }),
    ceiling = Bodies.rectangle(centerX, render.bounds.min.y, centerX * 2, 20, { isStatic: true }),
    rockOptions = { density: 0.004, id: -10 };

World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

(function create_shit() {

    var canvas = document.getElementById('canvas').childNodes[0];

    canvas.addEventListener('click', function(args) {

        var id = Math.random() * 100000000

        engine.world.bodies.push(Bodies.circle(centerX, centerY, 20, {
            id,
            density: 0.1,
            restitution: 0.9,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: '../static/img/' + Common.choose(['angry', 'cheery', 'cry', 'surprise']) + '.png',
                    xScale: 0.05,
                    yScale: 0.05
                }

            }
        }))

        var bodies = Composite.allBodies(engine.world);

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            if (body.id === id) {
                var forceMagnitude = Math.max(Math.min(Math.random(), 0.05), 0.05) * body.mass;

                Body.applyForce(body, body.position, {
                    x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
                    y: -forceMagnitude + Common.random() * -forceMagnitude
                });
            }


        }
    })


    Events.on(render, 'afterRender', function(event) {
        var context = render.context;
        context.font = "45px 'Cabin Sketch'";
        context.fillStyle = 'rgb(255, 255, 255)'
        context.fillText("Hits today: " + (Composite.allBodies(engine.world).length - 4), 10, 45);
    })
})()