import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-pygame',
    title: 'What is Pygame?',
    description: 'Learn what Pygame is, what it can build, and how it fits into Python game development.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 9,
    content: [
      { type: 'p', text: 'Pygame is a Python library for making 2D games and interactive multimedia apps. It gives you tools for windows, drawing, images, sound, keyboard and mouse input, and a main loop that keeps a game running frame by frame.' },
      { type: 'p', text: 'You write Python code. Pygame talks to your computer\'s display, audio, and input devices so you can focus on gameplay instead of low-level graphics APIs.' },
      { type: 'h2', text: 'What you can build' },
      { type: 'ul', items: ['Arcade-style games such as catch, dodge, or breakout', 'Simple platformers and top-down explorers', 'Visual demos, animations, and interactive toys', 'Learning projects that practice loops, events, and collision'] },
      {
        type: 'table',
        headers: ['Pygame idea', 'What it means'],
        rows: [
          ['Surface', 'A grid of pixels you can draw on'],
          ['Display', 'The window (or fullscreen) players see'],
          ['Event', 'A key press, mouse click, or quit action'],
          ['Clock', 'A helper that controls frame rate'],
          ['Rect', 'A rectangle for position, size, and collision']
        ]
      },
      { type: 'h2', text: 'Pygame and pygame-ce' },
      { type: 'p', text: 'Classic Pygame and pygame-ce (community edition) share most of the same beginner APIs: pygame.init(), display.set_mode(), event.get(), blit, Rect, and Clock. This course teaches those classic APIs so your code works with either package in most beginner cases.' },
      {
        type: 'code',
        title: 'The shape of every Pygame program',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    screen.fill((30, 30, 40))
    pygame.display.flip()

pygame.quit()`
      },
      { type: 'note', text: 'If you install pygame-ce, you still usually write import pygame. The package provides the pygame module name for compatibility.' },
      { type: 'tip', text: 'Pygame is great for learning game programming. When you outgrow it, the same ideas (game loop, sprites, collision) transfer to other engines.' },
      { type: 'try', text: 'List three tiny game ideas you could finish in a weekend. Keep them smaller than a full RPG - think catch falling fruit, not open-world adventure.' },
      { type: 'keypoints', items: ['Pygame is a Python library for 2D games and interactive apps.', 'Core ideas include surfaces, events, the game loop, and Rect.', 'Classic pygame APIs work with pygame and usually with pygame-ce.', 'Beginner games start small and grow one feature at a time.'] }
    ]
  },
  {
    slug: 'install-pygame',
    title: 'Install Python and Pygame',
    description: 'Install Python 3, set up a virtual environment, and install Pygame or pygame-ce.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 11,
    content: [
      { type: 'p', text: 'Before you open a game window, you need Python 3 and a Pygame package. Using a virtual environment keeps game libraries separate from other Python projects on your machine.' },
      { type: 'h2', text: 'Check Python' },
      {
        type: 'code',
        title: 'Check your Python version',
        language: 'bash',
        code: `python3 --version`
      },
      { type: 'p', text: 'You want Python 3.10 or newer when possible. On Windows, you may use py --version instead of python3 --version.' },
      { type: 'h2', text: 'Create a project folder and virtual environment' },
      {
        type: 'code',
        title: 'Create and activate a venv',
        language: 'bash',
        code: `mkdir pygame-practice
cd pygame-practice
python3 -m venv .venv
source .venv/bin/activate`
      },
      {
        type: 'code',
        title: 'Activate on Windows (PowerShell)',
        language: 'bash',
        code: `.venv\\Scripts\\Activate.ps1`
      },
      { type: 'h2', text: 'Install Pygame' },
      { type: 'p', text: 'You can install classic pygame or pygame-ce. For beginners, either is fine. pygame-ce is actively maintained and is a common recommendation for new projects.' },
      {
        type: 'code',
        title: 'Install pygame-ce (recommended for many new projects)',
        language: 'bash',
        code: `pip install pygame-ce`
      },
      {
        type: 'code',
        title: 'Or install classic pygame',
        language: 'bash',
        code: `pip install pygame`
      },
      {
        type: 'code',
        title: 'Verify the install',
        language: 'bash',
        code: `python -c "import pygame; print(pygame.version.ver)"`
      },
      { type: 'note', text: 'After installing pygame-ce, you still import it as pygame in your code.' },
      { type: 'warning', text: 'If import pygame fails, make sure your virtual environment is activated and that you installed into that same environment.' },
      { type: 'tip', text: 'Keep a requirements.txt later with pygame-ce or pygame pinned so teammates get the same package.' },
      { type: 'try', text: 'Create pygame-practice, activate a venv, install pygame or pygame-ce, and print the version with a one-line Python command.' },
      { type: 'keypoints', items: ['Use Python 3 for this course.', 'A virtual environment isolates project packages.', 'Install pygame or pygame-ce with pip.', 'Verify with import pygame and print the version.'] }
    ]
  },
  {
    slug: 'first-window',
    title: 'Your First Pygame Window',
    description: 'Create a window with pygame.init and display.set_mode, then quit cleanly.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 10,
    content: [
      { type: 'p', text: 'Every Pygame project starts by initializing the library and creating a display surface. That surface is the window players see.' },
      { type: 'h2', text: 'Initialize and open a window' },
      {
        type: 'code',
        title: 'first_window.py',
        language: 'python',
        code: `import pygame

pygame.init()

WIDTH = 800
HEIGHT = 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("My First Pygame Window")

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((40, 90, 140))
    pygame.display.flip()

pygame.quit()`
      },
      { type: 'h2', text: 'What each part does' },
      { type: 'ul', items: ['pygame.init() starts Pygame modules such as display and event handling.', 'display.set_mode((w, h)) creates the window and returns the screen Surface.', 'set_caption sets the title bar text.', 'screen.fill paints the whole window one color.', 'pygame.quit() shuts modules down when the loop ends.'] },
      { type: 'h2', text: 'Colors are RGB tuples' },
      { type: 'p', text: 'Pygame colors are usually (red, green, blue) with each value from 0 to 255. (0, 0, 0) is black and (255, 255, 255) is white.' },
      {
        type: 'code',
        title: 'Named color constants',
        language: 'python',
        code: `SKY = (135, 206, 235)
GRASS = (60, 160, 80)
screen.fill(SKY)`
      },
      { type: 'note', text: 'Closing the window sends a pygame.QUIT event. Handling it is how you stop the loop instead of freezing the process.' },
      { type: 'try', text: 'Change WIDTH, HEIGHT, the caption, and the fill color. Run the file and confirm the window updates.' },
      { type: 'keypoints', items: ['Call pygame.init() before creating a window.', 'display.set_mode returns the main screen Surface.', 'fill paints the screen; flip shows the frame.', 'Handle QUIT and call pygame.quit() when done.'] }
    ]
  },
  {
    slug: 'game-loop',
    title: 'The Game Loop',
    description: 'Understand the process-update-draw cycle that keeps a game alive every frame.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 12,
    content: [
      { type: 'p', text: 'A game loop is a while loop that repeats many times per second. Each pass is one frame: read input, update game state, draw, then show the result.' },
      { type: 'h2', text: 'The three jobs each frame' },
      {
        type: 'ol',
        items: [
          'Process events and input (quit, keys, mouse).',
          'Update positions, scores, timers, and collisions.',
          'Draw everything, then flip or update the display.'
        ]
      },
      {
        type: 'code',
        title: 'Clear game loop structure',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

x = 100
running = True
while running:
    # 1) Process
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # 2) Update
    x += 2
    if x > 800:
        x = -40

    # 3) Draw
    screen.fill((20, 20, 30))
    pygame.draw.rect(screen, (240, 180, 60), (x, 280, 40, 40))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'Why order matters' },
      { type: 'p', text: 'If you draw before you update, the player sees last frame\'s state. If you never process events, the window can feel frozen and quit may not work. Keep process, update, draw in that order until you have a reason to change it.' },
      {
        type: 'code',
        title: 'Mental model',
        language: 'text',
        code: `while running:
    process input
    update world
    draw world
    control frame rate`
      },
      { type: 'tip', text: 'Start every new feature by asking: does this belong in process, update, or draw?' },
      { type: 'try', text: 'Modify the moving square so it also moves down a little each frame, then wraps back to the top when it leaves the bottom.' },
      { type: 'keypoints', items: ['The game loop runs once per frame.', 'Each frame processes input, updates state, then draws.', 'clock.tick helps control frames per second.', 'Keep the three stages clear as your game grows.'] }
    ]
  },
  {
    slug: 'surfaces-colors',
    title: 'Surfaces and Colors',
    description: 'Learn what a Surface is, how colors work, and how the screen Surface relates to drawing.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 11,
    content: [
      { type: 'p', text: 'A Surface is a rectangular image in memory. The screen from display.set_mode is a Surface. Images you load later are Surfaces too. Drawing means changing pixels on a Surface.' },
      { type: 'h2', text: 'The screen Surface' },
      {
        type: 'code',
        title: 'Inspect the screen',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((640, 480))
print(screen.get_size())
print(screen.get_flags())
pygame.quit()`
      },
      { type: 'h2', text: 'Create your own Surface' },
      { type: 'p', text: 'You can make off-screen Surfaces for panels, tiles, or temporary drawings, then blit them onto the screen.' },
      {
        type: 'code',
        title: 'Custom surface and blit',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((640, 480))

panel = pygame.Surface((200, 100))
panel.fill((30, 120, 90))

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((15, 15, 25))
    screen.blit(panel, (40, 40))
    pygame.display.flip()

pygame.quit()`
      },
      { type: 'h2', text: 'Color formats' },
      { type: 'ul', items: ['RGB tuple: (r, g, b)', 'RGBA tuple: (r, g, b, a) when alpha is supported', 'pygame.Color("red") for named colors in many cases'] },
      {
        type: 'code',
        title: 'Using pygame.Color',
        language: 'python',
        code: `sky = pygame.Color("skyblue")
accent = pygame.Color(255, 120, 40)
screen.fill(sky)`
      },
      { type: 'note', text: 'blit copies one Surface onto another at a position. You will use blit constantly for images and text.' },
      { type: 'try', text: 'Create three small Surfaces with different colors and blit them in a row across the screen.' },
      { type: 'keypoints', items: ['A Surface is a pixel buffer you can draw on.', 'The display window is a Surface.', 'Colors are usually RGB tuples from 0 to 255.', 'blit copies one Surface onto another.'] }
    ]
  },
  {
    slug: 'drawing-shapes',
    title: 'Drawing Shapes',
    description: 'Draw rectangles, circles, lines, and polygons with pygame.draw.',
    level: 'beginner',
    section: 'Drawing & Display',
    order: 6,
    minutes: 12,
    content: [
      { type: 'p', text: 'pygame.draw gives you quick shapes for prototypes, UI bars, and simple games before you load image files. Shapes are drawn directly onto a Surface.' },
      { type: 'h2', text: 'Rectangles and circles' },
      {
        type: 'code',
        title: 'draw_shapes.py',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((25, 25, 35))
    pygame.draw.rect(screen, (80, 180, 255), (60, 80, 200, 120))
    pygame.draw.rect(screen, (255, 255, 255), (60, 80, 200, 120), width=3)
    pygame.draw.circle(screen, (255, 200, 60), (500, 200), 70)
    pygame.draw.line(screen, (220, 220, 220), (50, 400), (750, 400), 4)
    pygame.draw.polygon(screen, (200, 90, 120), [(400, 450), (460, 550), (340, 550)])
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'Common draw functions' },
      {
        type: 'table',
        headers: ['Function', 'Use'],
        rows: [
          ['pygame.draw.rect', 'Filled or outlined boxes'],
          ['pygame.draw.circle', 'Balls, buttons, dots'],
          ['pygame.draw.line', 'Borders, lasers, guides'],
          ['pygame.draw.polygon', 'Triangles and custom shapes'],
          ['pygame.draw.ellipse', 'Ovals inside a bounding rect']
        ]
      },
      { type: 'h2', text: 'Filled vs outline' },
      { type: 'p', text: 'For rect and circle, omit width or use width=0 for a filled shape. Pass a positive width for an outline only.' },
      {
        type: 'code',
        title: 'Outline rectangle',
        language: 'python',
        code: `pygame.draw.rect(screen, (255, 255, 255), (100, 100, 160, 80), width=2)`
      },
      { type: 'tip', text: 'Prototype your whole game with colored shapes first. Swap in images after movement and collision feel right.' },
      { type: 'try', text: 'Draw a simple house: a rectangle body, a triangle roof, a circle sun, and a ground line.' },
      { type: 'keypoints', items: ['pygame.draw draws shapes onto a Surface.', 'rect, circle, line, and polygon cover most beginner needs.', 'width controls outline vs fill for many shapes.', 'Shapes are perfect for early prototypes.'] }
    ]
  },
  {
    slug: 'flip-update',
    title: 'flip() vs update()',
    description: 'Learn how display.flip and display.update show your drawings on screen.',
    level: 'beginner',
    section: 'Drawing & Display',
    order: 7,
    minutes: 9,
    content: [
      { type: 'p', text: 'Drawing commands change the screen Surface in memory. Players only see those changes after you call pygame.display.flip() or pygame.display.update().' },
      { type: 'h2', text: 'flip updates the whole window' },
      {
        type: 'code',
        title: 'Using flip',
        language: 'python',
        code: `screen.fill((0, 0, 0))
pygame.draw.circle(screen, (255, 0, 0), (100, 100), 40)
pygame.display.flip()`
      },
      { type: 'p', text: 'flip() makes the entire display match your latest drawings. It is simple and fine for almost every beginner game.' },
      { type: 'h2', text: 'update can refresh part of the screen' },
      {
        type: 'code',
        title: 'Using update with no args vs a rect',
        language: 'python',
        code: `# Update everything (similar goal to flip in many setups)
pygame.display.update()

# Update only one rectangle region
dirty = pygame.Rect(90, 90, 80, 80)
pygame.display.update(dirty)`
      },
      {
        type: 'table',
        headers: ['Call', 'Typical use'],
        rows: [
          ['pygame.display.flip()', 'Full window refresh; simplest default'],
          ['pygame.display.update()', 'Full refresh when called with no arguments'],
          ['pygame.display.update(rect)', 'Refresh one region'],
          ['pygame.display.update(rect_list)', 'Refresh several dirty regions']
        ]
      },
      { type: 'note', text: 'On modern beginner projects, flip() is the clearest choice. Partial update matters more for older optimization tricks.' },
      { type: 'warning', text: 'If you forget flip or update, the window may stay black or freeze on the first frame even though your loop is running.' },
      { type: 'try', text: 'Take any drawing program and temporarily remove flip. Run it, then put flip back and compare.' },
      { type: 'keypoints', items: ['Drawing happens in memory until you flip or update.', 'flip() refreshes the whole display.', 'update() can refresh all or only dirty rects.', 'Beginners can default to flip() every frame.'] }
    ]
  },
  {
    slug: 'rects-basics',
    title: 'Rectangles and pygame.Rect',
    description: 'Use pygame.Rect for position, size, movement, and handy edge properties.',
    level: 'beginner',
    section: 'Drawing & Display',
    order: 8,
    minutes: 12,
    content: [
      { type: 'p', text: 'pygame.Rect stores x, y, width, and height. Games use Rects for players, enemies, buttons, and collision boxes because moving and testing overlap becomes easy.' },
      { type: 'h2', text: 'Create and read a Rect' },
      {
        type: 'code',
        title: 'Rect basics',
        language: 'python',
        code: `import pygame

player = pygame.Rect(100, 200, 50, 50)
print(player.x, player.y, player.width, player.height)
print(player.center)
print(player.topleft)
print(player.bottomright)`
      },
      { type: 'h2', text: 'Useful Rect attributes' },
      { type: 'ul', items: ['topleft, midtop, topright', 'midleft, center, midright', 'bottomleft, midbottom, bottomright', 'left, right, top, bottom, centerx, centery'] },
      {
        type: 'code',
        title: 'Move with attributes and inflate',
        language: 'python',
        code: `player = pygame.Rect(0, 0, 40, 40)
player.center = (400, 300)
player.x += 5
bigger = player.inflate(10, 10)`
      },
      { type: 'h2', text: 'Draw using a Rect' },
      {
        type: 'code',
        title: 'rect_move.py',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()
player = pygame.Rect(380, 280, 40, 40)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    player.x += 1
    screen.fill((18, 18, 28))
    pygame.draw.rect(screen, (100, 220, 140), player)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'tip', text: 'Prefer player.center or player.midbottom when aligning sprites so placement matches how you think about the object.' },
      { type: 'try', text: 'Create two Rects and print whether they overlap using player.colliderect(other).' },
      { type: 'keypoints', items: ['Rect holds x, y, width, and height.', 'Edge and center attributes make placement easier.', 'draw.rect can take a Rect directly.', 'Rects are the foundation of beginner collision.'] }
    ]
  },
  {
    slug: 'clock-framerate',
    title: 'Clock and Frame Rate',
    description: 'Control how fast your game runs with pygame.time.Clock and tick.',
    level: 'beginner',
    section: 'Drawing & Display',
    order: 9,
    minutes: 10,
    content: [
      { type: 'p', text: 'Without a frame rate limit, a game loop may run as fast as the CPU allows. That makes movement speed depend on the computer. pygame.time.Clock helps you target a steady frames-per-second (FPS) value.' },
      { type: 'h2', text: 'Use Clock.tick' },
      {
        type: 'code',
        title: 'Limit to 60 FPS',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((10, 10, 20))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'p', text: 'clock.tick(60) waits just long enough so the loop does not exceed about 60 frames per second. Call it once at the end of each frame.' },
      { type: 'h2', text: 'Read the real FPS' },
      {
        type: 'code',
        title: 'Show FPS in the caption',
        language: 'python',
        code: `fps = clock.get_fps()
pygame.display.set_caption(f"FPS: {fps:.0f}")`
      },
      {
        type: 'table',
        headers: ['FPS target', 'Feel'],
        rows: [
          ['30', 'Playable, a bit choppy for action'],
          ['60', 'Smooth default for most 2D games'],
          ['120+', 'Smoother on high-refresh displays; more CPU work']
        ]
      },
      { type: 'note', text: 'tick limits maximum speed. If drawing is heavy, real FPS can still fall below your target.' },
      { type: 'tip', text: 'For beginner movement, moving a fixed number of pixels per frame at 60 FPS is fine. Later you can multiply by delta time for frame-independent motion.' },
      { type: 'try', text: 'Run the same moving rectangle at tick(30) and tick(60). Notice how speed changes if you add a fixed x += 5 each frame.' },
      { type: 'keypoints', items: ['Clock helps stabilize frame rate.', 'Call clock.tick(fps) once per frame.', 'get_fps() reports recent performance.', 'Fixed per-frame speeds assume a stable FPS.'] }
    ]
  },
  {
    slug: 'events-quit',
    title: 'Events and Quitting',
    description: 'Handle the event queue, detect QUIT, and close your game cleanly.',
    level: 'beginner',
    section: 'Input',
    order: 10,
    minutes: 10,
    content: [
      { type: 'p', text: 'Pygame collects input and window actions in an event queue. Each loop, you should read that queue with pygame.event.get() so the window stays responsive.' },
      { type: 'h2', text: 'The event for loop' },
      {
        type: 'code',
        title: 'Handle QUIT and KEYDOWN',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False

    screen.fill((30, 30, 40))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'Common beginner event types' },
      { type: 'ul', items: ['pygame.QUIT - user closed the window', 'pygame.KEYDOWN / KEYUP - key pressed or released', 'pygame.MOUSEBUTTONDOWN / MOUSEBUTTONUP - mouse click', 'pygame.MOUSEMOTION - mouse moved'] },
      { type: 'h2', text: 'Why you must pump events' },
      { type: 'p', text: 'If you never call event.get() (or another event pump), many systems stop delivering updates and the window can show as not responding. Always process events every frame, even in tiny demos.' },
      { type: 'note', text: 'Setting running = False exits your loop. Call pygame.quit() after the loop to release Pygame resources.' },
      { type: 'warning', text: 'Avoid infinite loops with no event handling. Always give the player a way to quit.' },
      { type: 'try', text: 'Add a KEYDOWN handler so pressing Q quits, and print a message when QUIT fires.' },
      { type: 'keypoints', items: ['Events arrive through pygame.event.get().', 'QUIT means the window close button was used.', 'Process events every frame.', 'Quit the loop, then call pygame.quit().'] }
    ]
  },
  {
    slug: 'keyboard-input',
    title: 'Keyboard Input',
    description: 'Read keydown events and use key constants like K_LEFT and K_SPACE.',
    level: 'beginner',
    section: 'Input',
    order: 11,
    minutes: 11,
    content: [
      { type: 'p', text: 'Keyboard input in Pygame usually starts with KEYDOWN and KEYUP events. Each event has a key value such as pygame.K_a or pygame.K_LEFT.' },
      { type: 'h2', text: 'Move on key press' },
      {
        type: 'code',
        title: 'keydown_move.py',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()
player = pygame.Rect(375, 275, 50, 50)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT:
                player.x -= 20
            elif event.key == pygame.K_RIGHT:
                player.x += 20
            elif event.key == pygame.K_SPACE:
                print("Jump!")

    screen.fill((20, 24, 40))
    pygame.draw.rect(screen, (255, 210, 70), player)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'Useful key constants' },
      {
        type: 'table',
        headers: ['Constant', 'Key'],
        rows: [
          ['pygame.K_LEFT / K_RIGHT / K_UP / K_DOWN', 'Arrow keys'],
          ['pygame.K_a ... K_z', 'Letter keys'],
          ['pygame.K_SPACE', 'Space bar'],
          ['pygame.K_ESCAPE', 'Escape'],
          ['pygame.K_RETURN', 'Enter']
        ]
      },
      { type: 'note', text: 'KEYDOWN fires once when the key is pressed. It is perfect for jumps, shots, pauses, and menu choices. Continuous walking often uses get_pressed instead.' },
      { type: 'tip', text: 'Print event.key while experimenting if you forget a constant name.' },
      { type: 'try', text: 'Make UP and DOWN move the rectangle, and print a message when the player presses R to reset position.' },
      { type: 'keypoints', items: ['KEYDOWN reports a single key press.', 'Use pygame.K_ constants to test event.key.', 'Discrete actions fit KEYDOWN well.', 'Holding keys for movement is covered in a later lesson.'] }
    ]
  },
  {
    slug: 'mouse-input',
    title: 'Mouse Input',
    description: 'Track mouse position and respond to clicks with mouse events and mouse.get_pos.',
    level: 'beginner',
    section: 'Input',
    order: 12,
    minutes: 11,
    content: [
      { type: 'p', text: 'Mouse input lets players aim, click buttons, and drag objects. You can read position every frame or react to click events.' },
      { type: 'h2', text: 'Follow the cursor' },
      {
        type: 'code',
        title: 'mouse_follow.py',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:
                print("Left click at", event.pos)

    mx, my = pygame.mouse.get_pos()
    screen.fill((15, 20, 30))
    pygame.draw.circle(screen, (120, 220, 255), (mx, my), 16)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'Click buttons with collidepoint' },
      {
        type: 'code',
        title: 'Simple clickable rect',
        language: 'python',
        code: `button = pygame.Rect(300, 240, 200, 60)

for event in pygame.event.get():
    if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
        if button.collidepoint(event.pos):
            print("Button pressed")`
      },
      {
        type: 'table',
        headers: ['button value', 'Meaning'],
        rows: [
          ['1', 'Left'],
          ['2', 'Middle'],
          ['3', 'Right']
        ]
      },
      { type: 'tip', text: 'event.pos on mouse events matches the click location. get_pos() is handy when you need the cursor every frame without waiting for an event.' },
      { type: 'try', text: 'Draw a button Rect and change the screen color when the player left-clicks inside it.' },
      { type: 'keypoints', items: ['pygame.mouse.get_pos() returns (x, y).', 'MOUSEBUTTONDOWN includes button and pos.', 'collidepoint tests clicks on a Rect.', 'Mouse input is ideal for menus and aiming.'] }
    ]
  },
  {
    slug: 'holding-keys',
    title: 'Holding Keys vs Keydown',
    description: 'Compare KEYDOWN events with pygame.key.get_pressed for smooth held movement.',
    level: 'beginner',
    section: 'Input',
    order: 13,
    minutes: 12,
    content: [
      { type: 'p', text: 'KEYDOWN is a single event when a key goes down. For walking or flying while a key stays held, use pygame.key.get_pressed() each frame.' },
      { type: 'h2', text: 'Smooth movement with get_pressed' },
      {
        type: 'code',
        title: 'held_keys.py',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()
player = pygame.Rect(375, 275, 50, 50)
speed = 5

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player.x -= speed
    if keys[pygame.K_RIGHT]:
        player.x += speed
    if keys[pygame.K_UP]:
        player.y -= speed
    if keys[pygame.K_DOWN]:
        player.y += speed

    screen.fill((22, 22, 32))
    pygame.draw.rect(screen, (90, 200, 255), player)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      {
        type: 'table',
        headers: ['Approach', 'Best for'],
        rows: [
          ['KEYDOWN / KEYUP', 'Jumps, shots, pause, one-shot actions'],
          ['get_pressed()', 'Continuous movement while held'],
          ['Both together', 'Move with held keys, jump on KEYDOWN']
        ]
      },
      { type: 'h2', text: 'Combine both styles' },
      {
        type: 'code',
        title: 'Held move + tap jump',
        language: 'python',
        code: `keys = pygame.key.get_pressed()
if keys[pygame.K_a]:
    player.x -= speed
if keys[pygame.K_d]:
    player.x += speed

# inside event loop
# elif event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
#     jump()`
      },
      { type: 'note', text: 'Still call event.get() every frame even when movement uses get_pressed. You need events for quitting and discrete actions.' },
      { type: 'try', text: 'Change the example so diagonal movement does not feel faster, or lower speed and raise FPS to compare feel.' },
      { type: 'keypoints', items: ['KEYDOWN fires once per press.', 'get_pressed reads currently held keys each frame.', 'Use held keys for walking; events for taps.', 'Keep processing the event queue either way.'] }
    ]
  },
  {
    slug: 'images-blit',
    title: 'Images and blit',
    description: 'Load an image Surface and draw it with blit at a position.',
    level: 'beginner',
    section: 'Sprites & Media',
    order: 14,
    minutes: 11,
    content: [
      { type: 'p', text: 'Most games draw images, not only shapes. pygame.image.load reads a file into a Surface. blit copies that Surface onto the screen at an (x, y) position.' },
      { type: 'h2', text: 'Load and draw an image' },
      {
        type: 'code',
        title: 'blit_image.py',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

player_img = pygame.image.load("player.png")
player_pos = player_img.get_rect(center=(400, 300))

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((40, 60, 90))
    screen.blit(player_img, player_pos)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'Positions for blit' },
      { type: 'p', text: 'The second argument to blit can be an (x, y) tuple or a Rect. When you pass a Rect, Pygame uses its topleft as the draw position.' },
      {
        type: 'code',
        title: 'Blit with tuple or Rect',
        language: 'python',
        code: `screen.blit(player_img, (100, 120))
screen.blit(player_img, player_pos)`
      },
      { type: 'note', text: 'Put image files in your project folder, or use a path relative to the script. If load fails, check the filename and working directory.' },
      { type: 'tip', text: 'get_rect() on an image creates a Rect the same size as the image. Set center or topleft on that Rect to place it.' },
      { type: 'warning', text: 'PNG files with transparency need convert_alpha after load for best results. The next lesson covers that.' },
      { type: 'try', text: 'Load any PNG or JPG you have, blit it, and move its Rect with the arrow keys.' },
      { type: 'keypoints', items: ['image.load creates a Surface from a file.', 'blit draws one Surface onto another.', 'Use get_rect to place images easily.', 'Keep asset paths correct relative to how you run the script.'] }
    ]
  },
  {
    slug: 'load-convert-alpha',
    title: 'load, convert, convert_alpha',
    description: 'Speed up blits and preserve transparency with convert and convert_alpha.',
    level: 'beginner',
    section: 'Sprites & Media',
    order: 15,
    minutes: 10,
    content: [
      { type: 'p', text: 'After image.load, convert the Surface to match the display format. That makes blitting faster. Use convert_alpha when the image has transparent pixels.' },
      { type: 'h2', text: 'Recommended loading pattern' },
      {
        type: 'code',
        title: 'Load with convert_alpha',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))

# Opaque background art
sky = pygame.image.load("sky.png").convert()

# Sprite with transparent edges
hero = pygame.image.load("hero.png").convert_alpha()`
      },
      {
        type: 'table',
        headers: ['Method', 'When to use'],
        rows: [
          ['load(...)', 'Reads the file into a Surface'],
          ['convert()', 'Fast blits for images without alpha'],
          ['convert_alpha()', 'Keeps per-pixel transparency']
        ]
      },
      { type: 'h2', text: 'Why convert needs a display' },
      { type: 'p', text: 'convert and convert_alpha need an initialized display to know the target pixel format. Call display.set_mode before converting images.' },
      {
        type: 'code',
        title: 'Order matters',
        language: 'python',
        code: `pygame.init()
screen = pygame.display.set_mode((800, 600))
img = pygame.image.load("coin.png").convert_alpha()`
      },
      { type: 'note', text: 'On pygame-ce and pygame, this load-then-convert pattern is the same for beginners.' },
      { type: 'warning', text: 'Using convert() on a transparent PNG can lose soft edges or fill transparency with solid black. Prefer convert_alpha for sprites.' },
      { type: 'try', text: 'Load a transparent PNG with convert_alpha and blit it over a colorful background so you can see the edges.' },
      { type: 'keypoints', items: ['convert speeds up blits for opaque images.', 'convert_alpha keeps transparency.', 'Create the display before converting.', 'Sprites almost always want convert_alpha.'] }
    ]
  },
  {
    slug: 'fonts-text',
    title: 'Fonts and Text',
    description: 'Render score and labels with pygame.font and blit the text Surface.',
    level: 'beginner',
    section: 'Sprites & Media',
    order: 16,
    minutes: 11,
    content: [
      { type: 'p', text: 'Pygame draws text by creating a Font, rendering a string into a Surface, then blitting that Surface. This is how you show scores, lives, and menus.' },
      { type: 'h2', text: 'Render and blit text' },
      {
        type: 'code',
        title: 'fonts_text.py',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 48)
score = 0

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
            score += 1

    screen.fill((20, 20, 30))
    label = font.render(f"Score: {score}", True, (240, 240, 240))
    screen.blit(label, (20, 20))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'SysFont vs Font' },
      { type: 'ul', items: ['pygame.font.SysFont(name, size) uses a system font; None picks a default.', 'pygame.font.Font(path, size) loads a .ttf file from disk for consistent looks.'] },
      {
        type: 'code',
        title: 'Load a TTF file',
        language: 'python',
        code: `font = pygame.font.Font("assets/PressStart2P.ttf", 24)
text = font.render("Ready!", True, (255, 220, 80))`
      },
      { type: 'note', text: 'The True argument in render enables antialiasing for smoother letters. Use False for a sharper pixel look.' },
      { type: 'tip', text: 'Re-render text when the string changes. For a score that updates often, render once per frame is fine at beginner scale.' },
      { type: 'try', text: 'Show both Score and Lives on screen, and update them with different keys.' },
      { type: 'keypoints', items: ['Create a Font, then render text to a Surface.', 'Blit the text Surface like an image.', 'SysFont is quick; Font(path) is more portable for custom faces.', 'Antialiasing is the True/False flag in render.'] }
    ]
  },
  {
    slug: 'sound-music',
    title: 'Sound and Music Basics',
    description: 'Play short sound effects and background music with mixer.Sound and music.',
    level: 'beginner',
    section: 'Sprites & Media',
    order: 17,
    minutes: 12,
    content: [
      { type: 'p', text: 'Pygame\'s mixer plays audio. Use Sound for short effects like jumps and coins. Use music for longer looping background tracks.' },
      { type: 'h2', text: 'Initialize and play a sound' },
      {
        type: 'code',
        title: 'sound_basic.py',
        language: 'python',
        code: `import pygame

pygame.init()
pygame.mixer.init()
screen = pygame.display.set_mode((640, 480))

beep = pygame.mixer.Sound("coin.wav")

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
            beep.play()

    screen.fill((10, 10, 20))
    pygame.display.flip()

pygame.quit()`
      },
      { type: 'h2', text: 'Background music' },
      {
        type: 'code',
        title: 'Loop a music file',
        language: 'python',
        code: `pygame.mixer.music.load("theme.ogg")
pygame.mixer.music.play(loops=-1)
pygame.mixer.music.set_volume(0.5)
# pygame.mixer.music.stop()`
      },
      {
        type: 'table',
        headers: ['API', 'Role'],
        rows: [
          ['mixer.Sound', 'Short effects; multiple can overlap'],
          ['mixer.music', 'One streaming music track'],
          ['Sound.play()', 'Start an effect'],
          ['music.play(loops=-1)', 'Loop music forever']
        ]
      },
      { type: 'note', text: 'Common formats include WAV and OGG. MP3 support depends on system libraries, so OGG or WAV is safer for class projects.' },
      { type: 'tip', text: 'Keep effect volumes lower than you think. Ears tire quickly during testing.' },
      { type: 'try', text: 'Play a sound on click and start looping music when the program begins. Stop music on Escape.' },
      { type: 'keypoints', items: ['Call mixer.init or rely on pygame.init for audio setup.', 'Sound is for short effects; music is for tracks.', 'play(loops=-1) loops music.', 'Prefer WAV/OGG for portable beginner projects.'] }
    ]
  },
  {
    slug: 'collision-rects',
    title: 'Collision with Rect',
    description: 'Detect overlaps with colliderect and respond when two rectangles touch.',
    level: 'beginner',
    section: 'Sprites & Media',
    order: 18,
    minutes: 12,
    content: [
      { type: 'p', text: 'Rectangle collision is the standard beginner hit test. If two Rects overlap, colliderect returns True and you can add score, remove a life, or bounce an object.' },
      { type: 'h2', text: 'Test two rectangles' },
      {
        type: 'code',
        title: 'collision_rects.py',
        language: 'python',
        code: `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

player = pygame.Rect(100, 250, 50, 50)
coin = pygame.Rect(500, 260, 30, 30)
score = 0

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player.x -= 5
    if keys[pygame.K_RIGHT]:
        player.x += 5

    if player.colliderect(coin):
        score += 1
        coin.x = 900  # move off-screen as a simple "collect"

    screen.fill((18, 22, 34))
    pygame.draw.rect(screen, (80, 200, 255), player)
    pygame.draw.rect(screen, (255, 210, 70), coin)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'Related Rect helpers' },
      { type: 'ul', items: ['colliderect(other) - Rect vs Rect', 'collidepoint(x, y) - Rect vs point (great for mouse)', 'collidelist(list_of_rects) - index of first hit, or -1'] },
      {
        type: 'code',
        title: 'collidelist example',
        language: 'python',
        code: `enemies = [pygame.Rect(200, 100, 40, 40), pygame.Rect(400, 100, 40, 40)]
hit = player.collidelist(enemies)
if hit != -1:
    print("Hit enemy", hit)`
      },
      { type: 'tip', text: 'Image sprites often use image.get_rect() and then move that Rect. Collision uses the Rect, while blit uses the image.' },
      { type: 'try', text: 'Add a second coin and increase score only when the player touches a coin that is still active.' },
      { type: 'keypoints', items: ['colliderect detects overlapping Rects.', 'Respond immediately: score, damage, or bounce.', 'collidepoint connects mouse clicks to Rects.', 'collidelist checks against many Rects.'] }
    ]
  },
  {
    slug: 'clamp-screen',
    title: 'Keep Objects On Screen',
    description: 'Clamp positions so players and objects cannot leave the window bounds.',
    level: 'beginner',
    section: 'Sprites & Media',
    order: 19,
    minutes: 10,
    content: [
      { type: 'p', text: 'When objects move freely, they can leave the window. Clamping means limiting x and y so the Rect stays inside the screen.' },
      { type: 'h2', text: 'Clamp with attributes' },
      {
        type: 'code',
        title: 'clamp_player.py',
        language: 'python',
        code: `import pygame

pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
player = pygame.Rect(400, 300, 50, 50)
speed = 6

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player.x -= speed
    if keys[pygame.K_RIGHT]:
        player.x += speed
    if keys[pygame.K_UP]:
        player.y -= speed
    if keys[pygame.K_DOWN]:
        player.y += speed

    if player.left < 0:
        player.left = 0
    if player.right > WIDTH:
        player.right = WIDTH
    if player.top < 0:
        player.top = 0
    if player.bottom > HEIGHT:
        player.bottom = HEIGHT

    screen.fill((16, 16, 28))
    pygame.draw.rect(screen, (255, 120, 120), player)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'clamp_ip helper' },
      {
        type: 'code',
        title: 'Clamp in one call',
        language: 'python',
        code: `bounds = screen.get_rect()
player.clamp_ip(bounds)`
      },
      { type: 'p', text: 'clamp_ip moves the Rect just enough to stay inside another Rect. It is shorter than writing four if statements.' },
      { type: 'note', text: 'Clamping keeps the whole Rect visible. If you only clamp the center point, corners can still hang off the edge.' },
      { type: 'try', text: 'Replace the four if statements with clamp_ip and confirm behavior feels the same.' },
      { type: 'keypoints', items: ['Clamping stops objects from leaving the screen.', 'Compare left/right/top/bottom to screen edges.', 'clamp_ip is a short built-in option.', 'Use clamping on the player every frame after movement.'] }
    ]
  },
  {
    slug: 'move-player',
    title: 'Move a Player Rectangle',
    description: 'Build a controllable player with held keys, speed, and screen clamping.',
    level: 'beginner',
    section: 'First Game',
    order: 20,
    minutes: 12,
    content: [
      { type: 'p', text: 'This lesson combines input, Rect movement, frame rate, and clamping into a player you can steer. It is the base for the catch game later.' },
      {
        type: 'code',
        title: 'move_player.py',
        language: 'python',
        code: `import pygame

pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Move Player")
clock = pygame.time.Clock()

player = pygame.Rect(0, 0, 60, 20)
player.midbottom = (WIDTH // 2, HEIGHT - 30)
speed = 7

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] or keys[pygame.K_a]:
        player.x -= speed
    if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
        player.x += speed

    player.clamp_ip(screen.get_rect())

    screen.fill((24, 28, 48))
    pygame.draw.rect(screen, (100, 220, 160), player)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'Design choices' },
      { type: 'ul', items: ['A wide short Rect works like a paddle or basket.', 'midbottom placement sits the player on an imaginary floor.', 'A and D mirror arrow keys for comfort.', 'clamp_ip keeps the paddle fully on screen.'] },
      { type: 'tip', text: 'Tune speed until the paddle can cross the screen in roughly one or two seconds. That usually feels fair for catch games.' },
      { type: 'try', text: 'Add up and down movement, then change the player into a square explorer instead of a paddle.' },
      { type: 'keypoints', items: ['Held keys move the player each frame.', 'Store player state in a Rect.', 'Clamp after moving.', 'This paddle pattern returns in the mini project.'] }
    ]
  },
  {
    slug: 'falling-objects',
    title: 'Falling Objects',
    description: 'Spawn objects that fall downward and reset when they leave the screen.',
    level: 'beginner',
    section: 'First Game',
    order: 21,
    minutes: 12,
    content: [
      { type: 'p', text: 'Falling objects teach timers, lists, and simple spawning. Each object is a Rect (or a small dict) that moves down every frame.' },
      {
        type: 'code',
        title: 'falling_objects.py',
        language: 'python',
        code: `import pygame
import random

pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

player = pygame.Rect(0, 0, 80, 20)
player.midbottom = (WIDTH // 2, HEIGHT - 40)
fallers = []
SPAWN = pygame.USEREVENT + 1
pygame.time.set_timer(SPAWN, 800)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == SPAWN:
            rect = pygame.Rect(random.randint(0, WIDTH - 30), -40, 30, 30)
            fallers.append({"rect": rect, "speed": random.randint(3, 7)})

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player.x -= 7
    if keys[pygame.K_RIGHT]:
        player.x += 7
    player.clamp_ip(screen.get_rect())

    for item in fallers:
        item["rect"].y += item["speed"]

    fallers = [item for item in fallers if item["rect"].top <= HEIGHT]

    screen.fill((20, 24, 40))
    pygame.draw.rect(screen, (120, 220, 170), player)
    for item in fallers:
        pygame.draw.rect(screen, (255, 180, 70), item["rect"])
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      },
      { type: 'h2', text: 'Why a timer event helps' },
      { type: 'p', text: 'pygame.time.set_timer posts a custom event on a schedule. That keeps spawning logic out of your update math and makes cadence easy to tune.' },
      { type: 'note', text: 'Filtering the list removes objects that fell past the bottom so memory does not grow forever.' },
      { type: 'try', text: 'Change spawn interval and fall speed ranges. Find values that feel busy but still readable.' },
      { type: 'keypoints', items: ['Falling objects are Rects updated each frame.', 'USEREVENT timers are great for spawning.', 'Remove off-screen objects from your list.', 'Random x positions keep the pattern interesting.'] }
    ]
  },
  {
    slug: 'score-lives',
    title: 'Score and Lives',
    description: 'Track score and lives, update them on catch or miss, and draw them with a font.',
    level: 'beginner',
    section: 'First Game',
    order: 22,
    minutes: 12,
    content: [
      { type: 'p', text: 'Score and lives turn movement demos into games. Catching an object adds points. Missing one subtracts a life. At zero lives, the run ends.' },
      {
        type: 'code',
        title: 'Score and lives core logic',
        language: 'python',
        code: `import pygame
import random

pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 40)

player = pygame.Rect(0, 0, 90, 20)
player.midbottom = (WIDTH // 2, HEIGHT - 36)
fallers = []
score = 0
lives = 3
SPAWN = pygame.USEREVENT + 1
pygame.time.set_timer(SPAWN, 700)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == SPAWN:
            fallers.append(pygame.Rect(random.randint(0, WIDTH - 24), -30, 24, 24))

    keys = pygame.key.get_pressed()
    player.x += (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * 8
    player.clamp_ip(screen.get_rect())

    still_falling = []
    for rect in fallers:
        rect.y += 5
        if player.colliderect(rect):
            score += 1
        elif rect.top > HEIGHT:
            lives -= 1
        else:
            still_falling.append(rect)
    fallers = still_falling

    if lives <= 0:
        running = False

    screen.fill((18, 20, 32))
    pygame.draw.rect(screen, (100, 210, 160), player)
    for rect in fallers:
        pygame.draw.rect(screen, (255, 200, 80), rect)
    hud = font.render(f"Score: {score}   Lives: {lives}", True, (240, 240, 240))
    screen.blit(hud, (16, 12))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
print("Final score:", score)`
      },
      { type: 'h2', text: 'Rules to keep clear' },
      { type: 'ul', items: ['One collision should count once - remove or ignore the object after scoring.', 'Misses happen when an object passes the bottom without being caught.', 'Draw the HUD every frame so players always see state.'] },
      { type: 'tip', text: 'Boolean arithmetic like keys[K_RIGHT] - keys[K_LEFT] yields -1, 0, or 1 and keeps left/right code compact.' },
      { type: 'try', text: 'Add a bonus: every 5 points, increase fall speed by 1.' },
      { type: 'keypoints', items: ['Score and lives are ordinary Python variables.', 'Update them during collision and miss checks.', 'Render HUD text each frame.', 'End the loop when lives reach zero.'] }
    ]
  },
  {
    slug: 'organize-functions',
    title: 'Organize With Functions',
    description: 'Split a growing game into functions for setup, input, update, and draw.',
    level: 'beginner',
    section: 'First Game',
    order: 23,
    minutes: 13,
    content: [
      { type: 'p', text: 'As files grow, a single long loop becomes hard to change. Functions give each job a name: handle events, move the player, spawn fallers, draw the frame.' },
      {
        type: 'code',
        title: 'Organized sketch',
        language: 'python',
        code: `import pygame
import random

WIDTH, HEIGHT = 800, 600

def make_player():
    player = pygame.Rect(0, 0, 90, 20)
    player.midbottom = (WIDTH // 2, HEIGHT - 36)
    return player

def handle_events(state):
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            state["running"] = False
        elif event.type == state["SPAWN"]:
            rect = pygame.Rect(random.randint(0, WIDTH - 24), -30, 24, 24)
            state["fallers"].append(rect)

def update(state):
    keys = pygame.key.get_pressed()
    state["player"].x += (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * 8
    state["player"].clamp_ip(pygame.Rect(0, 0, WIDTH, HEIGHT))

    remaining = []
    for rect in state["fallers"]:
        rect.y += state["fall_speed"]
        if state["player"].colliderect(rect):
            state["score"] += 1
        elif rect.top > HEIGHT:
            state["lives"] -= 1
        else:
            remaining.append(rect)
    state["fallers"] = remaining
    if state["lives"] <= 0:
        state["running"] = False

def draw(screen, font, state):
    screen.fill((18, 20, 32))
    pygame.draw.rect(screen, (100, 210, 160), state["player"])
    for rect in state["fallers"]:
        pygame.draw.rect(screen, (255, 200, 80), rect)
    hud = font.render(
        f"Score: {state['score']}   Lives: {state['lives']}",
        True,
        (240, 240, 240),
    )
    screen.blit(hud, (16, 12))
    pygame.display.flip()

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()
    font = pygame.font.SysFont(None, 40)
    SPAWN = pygame.USEREVENT + 1
    pygame.time.set_timer(SPAWN, 700)
    state = {
        "running": True,
        "player": make_player(),
        "fallers": [],
        "score": 0,
        "lives": 3,
        "fall_speed": 5,
        "SPAWN": SPAWN,
    }
    while state["running"]:
        handle_events(state)
        update(state)
        draw(screen, font, state)
        clock.tick(60)
    pygame.quit()
    print("Final score:", state["score"])

if __name__ == "__main__":
    main()`
      },
      { type: 'tip', text: 'A state dict (or later a class) keeps related values together so functions do not need a dozen parameters.' },
      { type: 'note', text: 'You do not need perfect architecture. Even two or three functions make the mini project easier to finish.' },
      { type: 'try', text: 'Extract a reset_game(state) function that restores score, lives, fallers, and player position.' },
      { type: 'keypoints', items: ['Split process, update, and draw into functions.', 'Keep shared values in a state structure.', 'main() owns setup and the loop.', 'Small functions make features safer to add.'] }
    ]
  },
  {
    slug: 'mini-catch-game',
    title: 'Mini Project: Catch Game',
    description: 'Build a complete catch game with player, falling items, score, lives, and game over.',
    level: 'beginner',
    section: 'First Game',
    order: 24,
    minutes: 14,
    content: [
      { type: 'p', text: 'Time to assemble the beginner toolkit into one playable game. Catch falling blocks with a paddle. Earn points. Lose lives on misses. Show a game-over message.' },
      { type: 'h2', text: 'Goals for the mini project' },
      { type: 'ol', items: ['Move a paddle with left/right keys.', 'Spawn falling targets on a timer.', 'Add score on catch; lose lives on miss.', 'Show HUD and a game-over screen.', 'Press R to restart after game over.'] },
      {
        type: 'code',
        title: 'catch_game.py',
        language: 'python',
        code: `import pygame
import random

WIDTH, HEIGHT = 800, 600
WHITE = (240, 240, 240)
BG = (18, 22, 36)
PADDLE = (102, 220, 170)
ITEM = (255, 196, 84)

def reset(state):
    state["player"].midbottom = (WIDTH // 2, HEIGHT - 36)
    state["fallers"] = []
    state["score"] = 0
    state["lives"] = 3
    state["fall_speed"] = 4
    state["alive"] = True

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Catch Game")
    clock = pygame.time.Clock()
    font = pygame.font.SysFont(None, 42)
    big = pygame.font.SysFont(None, 64)
    SPAWN = pygame.USEREVENT + 1
    pygame.time.set_timer(SPAWN, 650)

    player = pygame.Rect(0, 0, 100, 22)
    state = {"player": player, "fallers": [], "score": 0, "lives": 3,
             "fall_speed": 4, "alive": True, "running": True}
    reset(state)

    while state["running"]:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                state["running"] = False
            elif event.type == SPAWN and state["alive"]:
                state["fallers"].append(
                    pygame.Rect(random.randint(0, WIDTH - 26), -28, 26, 26)
                )
            elif event.type == pygame.KEYDOWN and not state["alive"]:
                if event.key == pygame.K_r:
                    reset(state)

        if state["alive"]:
            keys = pygame.key.get_pressed()
            state["player"].x += (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * 8
            state["player"].clamp_ip(screen.get_rect())

            keep = []
            for rect in state["fallers"]:
                rect.y += state["fall_speed"]
                if state["player"].colliderect(rect):
                    state["score"] += 1
                    if state["score"] % 5 == 0:
                        state["fall_speed"] += 1
                elif rect.top > HEIGHT:
                    state["lives"] -= 1
                else:
                    keep.append(rect)
            state["fallers"] = keep
            if state["lives"] <= 0:
                state["alive"] = False

        screen.fill(BG)
        pygame.draw.rect(screen, PADDLE, state["player"])
        for rect in state["fallers"]:
            pygame.draw.rect(screen, ITEM, rect)
        hud = font.render(
            f"Score: {state['score']}   Lives: {state['lives']}", True, WHITE
        )
        screen.blit(hud, (16, 12))
        if not state["alive"]:
            msg = big.render("Game Over - press R", True, WHITE)
            screen.blit(msg, msg.get_rect(center=(WIDTH // 2, HEIGHT // 2)))
        pygame.display.flip()
        clock.tick(60)

    pygame.quit()

if __name__ == "__main__":
    main()`
      },
      { type: 'tip', text: 'If you want polish, replace rectangles with PNG sprites and add a coin sound on catch. Behavior can stay the same.' },
      { type: 'try', text: 'Add a high-score variable that survives restarts within the same run, and show it on the game-over screen.' },
      { type: 'keypoints', items: ['The catch game combines loop, input, spawn, collision, and HUD.', 'reset() makes restarts easy.', 'Difficulty can rise with score.', 'A clear game-over state keeps the loop simple.'] }
    ]
  },
  {
    slug: 'beginner-review',
    title: 'Beginner Review and Next Steps',
    description: 'Review beginner Pygame skills and choose practical next projects to grow.',
    level: 'beginner',
    section: 'First Game',
    order: 25,
    minutes: 10,
    content: [
      { type: 'p', text: 'You now have the core beginner path: install Pygame, open a window, run a game loop, draw shapes and images, read input, play sounds, detect collisions, and finish a small catch game.' },
      { type: 'h2', text: 'Skills checklist' },
      { type: 'ul', items: ['pygame.init, display.set_mode, flip, and quit', 'Event queue plus get_pressed for held keys', 'Rect movement, clamp, and colliderect', 'image.load with convert_alpha and blit', 'Font render for HUD text', 'Clock.tick for stable frame rate', 'Sound effects and optional music', 'Functions that separate update and draw'] },
      { type: 'h2', text: 'Common beginner bugs' },
      {
        type: 'table',
        headers: ['Symptom', 'Likely cause'],
        rows: [
          ['Window freezes or will not close', 'Events not processed each frame'],
          ['Black screen forever', 'Missing flip/update or draw after fill'],
          ['Player moves too fast on some PCs', 'No clock.tick, or speed tied only to FPS'],
          ['Transparent PNG looks wrong', 'Used convert instead of convert_alpha'],
          ['Image file not found', 'Wrong path or wrong working directory']
        ]
      },
      { type: 'h2', text: 'Good next projects' },
      { type: 'ol', items: ['Dodge falling hazards instead of catching them.', 'Add a second player with different keys.', 'Build a start menu with clickable Rect buttons.', 'Replace shapes with sprite sheets and simple animation frames.', 'Learn Sprite and Group classes for many objects.'] },
      {
        type: 'code',
        title: 'A tiny habit for every new file',
        language: 'python',
        code: `import pygame

def main():
    pygame.init()
    screen = pygame.display.set_mode((800, 600))
    clock = pygame.time.Clock()
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        screen.fill((20, 20, 30))
        pygame.display.flip()
        clock.tick(60)
    pygame.quit()

if __name__ == "__main__":
    main()`
      },
      { type: 'note', text: 'pygame-ce remains a strong default install for new work, while the APIs you learned stay classic and transferable.' },
      { type: 'try', text: 'Fork your catch game and change one major rule: maybe targets bounce, or catching the wrong color costs a life.' },
      { type: 'keypoints', items: ['Beginner Pygame is loops, Surfaces, Rects, events, and assets.', 'Stable structure beats clever tricks early on.', 'Ship small complete games before big engines.', 'Next, deepen sprites, scenes, and polish.'] }
    ]
  }
];
