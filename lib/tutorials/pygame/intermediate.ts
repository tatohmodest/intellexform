import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'sprite-class',
    title: 'The Sprite Class',
    description:
      'Subclass pygame.sprite.Sprite to give game objects an image, a rect, and a clean update method.',
    level: 'intermediate',
    section: 'Sprites & Groups',
    order: 26,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'pygame.sprite.Sprite is the base class for most game objects. A sprite holds an image surface, a rect for position and size, and optional update logic that runs every frame.',
      },
      {
        type: 'p',
        text: 'Once objects inherit from Sprite, you can manage them with groups, draw them together, and remove them cleanly with kill().',
      },
      { type: 'h2', text: 'Create a custom sprite' },
      {
        type: 'code',
        language: 'python',
        title: 'player.py',
        code: `import pygame


class Player(pygame.sprite.Sprite):
    def __init__(self, x: int, y: int) -> None:
        super().__init__()
        self.image = pygame.Surface((40, 48))
        self.image.fill((70, 160, 220))
        self.rect = self.image.get_rect(midbottom=(x, y))
        self.speed = 220

    def update(self, dt: float, keys: pygame.key.ScancodeWrapper) -> None:
        dx = 0
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            dx -= self.speed * dt
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            dx += self.speed * dt
        self.rect.x += int(dx)`,
      },
      {
        type: 'ul',
        items: [
          'Call super().__init__() so the sprite can join groups.',
          'Set self.image to a Surface (drawn or loaded).',
          'Set self.rect from that image for position and collisions.',
          'Put per-frame behavior in update().',
        ],
      },
      { type: 'h2', text: 'Use the sprite in a window' },
      {
        type: 'code',
        language: 'python',
        title: 'main.py',
        code: `import pygame
from player import Player

pygame.init()
screen = pygame.display.set_mode((800, 480))
clock = pygame.time.Clock()
player = Player(400, 400)

running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    player.update(dt, keys)

    screen.fill((24, 28, 36))
    screen.blit(player.image, player.rect)
    pygame.display.flip()

pygame.quit()`,
      },
      {
        type: 'note',
        text: 'image and rect are the two required attributes for drawing with sprite groups. Without them, Group.draw() cannot place the sprite.',
      },
      {
        type: 'tip',
        text: 'Keep movement and animation inside update(). Keep event handling (one-shot presses, quit) in the main loop or a dedicated input method.',
      },
      {
        type: 'try',
        text: 'Add a jump_power attribute and make the player move up for a short time when Space is pressed. Keep the logic inside Player.update().',
      },
      {
        type: 'keypoints',
        items: [
          'Subclass pygame.sprite.Sprite for reusable game objects.',
          'Every drawable sprite needs image and rect.',
          'update() is the natural place for frame-based behavior.',
          'Sprites pair with groups for drawing and lifecycle management.',
        ],
      },
    ],
  },
  {
    slug: 'sprite-groups',
    title: 'Sprite Groups',
    description:
      'Organize sprites into Group and GroupSingle containers so you can update and draw many objects at once.',
    level: 'intermediate',
    section: 'Sprites & Groups',
    order: 27,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A sprite group is a container that holds sprites. Groups let you call update() and draw() on every member, test collisions against whole collections, and keep related objects together.',
      },
      {
        type: 'p',
        text: 'Common choices are pygame.sprite.Group for many objects and pygame.sprite.GroupSingle when only one sprite should exist at a time, such as the player.',
      },
      { type: 'h2', text: 'Add sprites to groups' },
      {
        type: 'code',
        language: 'python',
        title: 'groups_demo.py',
        code: `import pygame


class Coin(pygame.sprite.Sprite):
    def __init__(self, pos: tuple[int, int]) -> None:
        super().__init__()
        self.image = pygame.Surface((20, 20))
        self.image.fill((240, 200, 60))
        self.rect = self.image.get_rect(center=pos)


pygame.init()
screen = pygame.display.set_mode((640, 360))
clock = pygame.time.Clock()

coins = pygame.sprite.Group()
coins.add(Coin((120, 80)), Coin((300, 140)), Coin((480, 100)))

player = pygame.sprite.GroupSingle()
# player.add(Player(...))

running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    coins.update(dt)
    player.update(dt)

    screen.fill((18, 22, 30))
    coins.draw(screen)
    player.draw(screen)
    pygame.display.flip()

pygame.quit()`,
      },
      {
        type: 'ul',
        items: [
          'group.add(sprite) or pass groups into Sprite.__init__ via *groups.',
          'GroupSingle.sprite is the current member, or None.',
          'len(group) and for sprite in group work like normal containers.',
          'A sprite can belong to several groups at once.',
        ],
      },
      { type: 'h2', text: 'Pass groups into the constructor' },
      {
        type: 'code',
        language: 'python',
        title: 'Passing groups on create',
        code: `class Bullet(pygame.sprite.Sprite):
    def __init__(self, pos, *groups) -> None:
        super().__init__(*groups)
        self.image = pygame.Surface((6, 12))
        self.image.fill((255, 240, 180))
        self.rect = self.image.get_rect(center=pos)
        self.vy = -400

    def update(self, dt: float) -> None:
        self.rect.y += int(self.vy * dt)
        if self.rect.bottom < 0:
            self.kill()


bullets = pygame.sprite.Group()
Bullet((200, 300), bullets)  # added immediately`,
      },
      {
        type: 'note',
        text: 'Passing *groups into super().__init__(*groups) is a common pygame pattern. The sprite joins those groups as soon as it is created.',
      },
      {
        type: 'tip',
        text: 'Use separate groups for layers: all_sprites for drawing order helpers, enemies for AI, bullets for projectiles, and tiles for solid world geometry.',
      },
      {
        type: 'try',
        text: 'Create an enemies Group with three sprites at different x positions. Print len(enemies) and loop through the group to print each rect.center.',
      },
      {
        type: 'keypoints',
        items: [
          'Groups hold sprites and expose update() and draw().',
          'GroupSingle is ideal for a single player or cursor sprite.',
          'Sprites can join groups at construction time.',
          'Split groups by role to keep collision and update code clear.',
        ],
      },
    ],
  },
  {
    slug: 'update-draw-groups',
    title: 'update and draw Groups',
    description:
      'Drive the game loop with group.update() and group.draw(screen), including custom draw order when needed.',
    level: 'intermediate',
    section: 'Sprites & Groups',
    order: 28,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'After sprites live in groups, the main loop becomes shorter. Call update once per group, clear the screen, draw each group, then flip the display.',
      },
      {
        type: 'p',
        text: 'Group.update() forwards any extra arguments to every sprite.update(). That is how you pass dt, keys, or level data without global variables.',
      },
      { type: 'h2', text: 'Pass arguments through update' },
      {
        type: 'code',
        language: 'python',
        title: 'Forwarding dt and keys',
        code: `import pygame


class Mover(pygame.sprite.Sprite):
    def __init__(self, pos) -> None:
        super().__init__()
        self.image = pygame.Surface((32, 32))
        self.image.fill((90, 200, 140))
        self.rect = self.image.get_rect(center=pos)
        self.speed = 180

    def update(self, dt: float, keys) -> None:
        if keys[pygame.K_LEFT]:
            self.rect.x -= int(self.speed * dt)
        if keys[pygame.K_RIGHT]:
            self.rect.x += int(self.speed * dt)


pygame.init()
screen = pygame.display.set_mode((720, 400))
clock = pygame.time.Clock()
movers = pygame.sprite.Group(Mover((360, 200)))

running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    movers.update(dt, keys)

    screen.fill((20, 24, 32))
    movers.draw(screen)
    pygame.display.flip()

pygame.quit()`,
      },
      { type: 'h2', text: 'Control draw order' },
      {
        type: 'code',
        language: 'python',
        title: 'LayeredUpdates for z-order',
        code: `# LayeredUpdates draws lower layers first
layers = pygame.sprite.LayeredUpdates()

background = BackgroundSprite()
player = PlayerSprite()
hud_icon = HudSprite()

layers.add(background, layer=0)
layers.add(player, layer=1)
layers.add(hud_icon, layer=2)

# later in the loop
layers.update(dt)
layers.draw(screen)`,
      },
      {
        type: 'ul',
        items: [
          'Group.draw(surface) blits each sprite.image at sprite.rect.',
          'LayeredUpdates and OrderedUpdates help when overlapping matters.',
          'You can still blit manually for special effects or cameras.',
          'Clear the screen (or a background) before drawing each frame.',
        ],
      },
      {
        type: 'note',
        text: 'If one sprite.update signature differs from another, do not put those sprites in the same group.update(...) call. Keep signatures consistent per group.',
      },
      {
        type: 'tip',
        text: 'For a camera world, update sprites in world coordinates, then draw with an offset. Groups still help with updates even if you custom-draw.',
      },
      {
        type: 'try',
        text: 'Put coins and a player in two groups. Call both update methods with dt, then draw coins first and the player second so the player appears on top.',
      },
      {
        type: 'keypoints',
        items: [
          'group.update(*args) calls sprite.update(*args) for each member.',
          'group.draw(screen) blits image at rect for every sprite.',
          'Use LayeredUpdates when z-order matters.',
          'Match update signatures within a group.',
        ],
      },
    ],
  },
  {
    slug: 'custom-events',
    title: 'Custom Events and Timers',
    description:
      'Schedule recurring actions with pygame.USEREVENT, set_timer, and custom event types for spawning and cooldowns.',
    level: 'intermediate',
    section: 'Sprites & Groups',
    order: 29,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Not every timed action belongs in update() with manual counters. Pygame can post custom events on a timer so your event loop handles spawns, cooldowns, and UI flashes the same way it handles key presses.',
      },
      {
        type: 'p',
        text: 'Reserve event IDs with pygame.USEREVENT and friends, then call pygame.time.set_timer(event_type, milliseconds).',
      },
      { type: 'h2', text: 'Define and fire a custom event' },
      {
        type: 'code',
        language: 'python',
        title: 'Spawn on a timer',
        code: `import pygame
import random

SPAWN_ENEMY = pygame.USEREVENT + 1
FLASH_HUD = pygame.USEREVENT + 2

pygame.init()
screen = pygame.display.set_mode((800, 450))
clock = pygame.time.Clock()

pygame.time.set_timer(SPAWN_ENEMY, 1200)  # every 1.2 seconds

enemies = pygame.sprite.Group()


class Enemy(pygame.sprite.Sprite):
    def __init__(self, x: int) -> None:
        super().__init__()
        self.image = pygame.Surface((36, 36))
        self.image.fill((220, 80, 80))
        self.rect = self.image.get_rect(midtop=(x, -40))
        self.vy = 120

    def update(self, dt: float) -> None:
        self.rect.y += int(self.vy * dt)
        if self.rect.top > 450:
            self.kill()


running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == SPAWN_ENEMY:
            Enemy(random.randint(40, 760)).add(enemies)
        elif event.type == FLASH_HUD:
            print("hud flash")

    enemies.update(dt)
    screen.fill((16, 18, 24))
    enemies.draw(screen)
    pygame.display.flip()

pygame.quit()`,
      },
      { type: 'h2', text: 'One-shot timers and cancelling' },
      {
        type: 'code',
        language: 'python',
        title: 'Start and stop timers',
        code: `# Start repeating
pygame.time.set_timer(SPAWN_ENEMY, 1000)

# Stop that timer
pygame.time.set_timer(SPAWN_ENEMY, 0)

# Post a one-shot event yourself
pygame.event.post(pygame.event.Event(FLASH_HUD, amount=5))`,
      },
      {
        type: 'ul',
        items: [
          'USEREVENT + n keeps your IDs away from built-in event types.',
          'set_timer(type, 0) disables the timer.',
          'Event objects can carry extra attributes (amount=5 above).',
          'Timers keep firing while the app runs, even if a state ignores them - handle that in your state machine.',
        ],
      },
      {
        type: 'note',
        text: 'For short animation delays inside a single sprite, a float timer in update() is often simpler. Prefer custom events for game-wide schedules.',
      },
      {
        type: 'tip',
        text: 'Name event constants in ALL_CAPS at module level so the event loop stays readable as the project grows.',
      },
      {
        type: 'try',
        text: 'Create a POWERUP_TICK event every 3 seconds. On each tick, print a message and spawn a yellow square sprite into a pickups group.',
      },
      {
        type: 'keypoints',
        items: [
          'Custom events use pygame.USEREVENT offsets.',
          'pygame.time.set_timer schedules repeating event posts.',
          'Handle custom events beside QUIT and KEYDOWN in the loop.',
          'Disable timers with interval 0 when a mode ends.',
        ],
      },
    ],
  },
  {
    slug: 'kill-sprites',
    title: 'Removing Sprites with kill()',
    description:
      'Remove sprites from all groups safely with kill(), and clean up bullets, enemies, and pickups when they leave play.',
    level: 'intermediate',
    section: 'Sprites & Groups',
    order: 30,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'When a sprite should leave the game - collected coin, exploded enemy, off-screen bullet - call self.kill(). That removes it from every group it belongs to.',
      },
      {
        type: 'p',
        text: 'You do not need to track list indices or manually delete references from each container. After kill(), the sprite is no longer updated or drawn by those groups.',
      },
      { type: 'h2', text: 'Kill on collision or bounds' },
      {
        type: 'code',
        language: 'python',
        title: 'Coins and bullets cleanup',
        code: `import pygame


class Coin(pygame.sprite.Sprite):
    def __init__(self, pos, *groups) -> None:
        super().__init__(*groups)
        self.image = pygame.Surface((18, 18))
        self.image.fill((250, 210, 70))
        self.rect = self.image.get_rect(center=pos)


class Bullet(pygame.sprite.Sprite):
    def __init__(self, pos, *groups) -> None:
        super().__init__(*groups)
        self.image = pygame.Surface((4, 10))
        self.image.fill((255, 255, 220))
        self.rect = self.image.get_rect(center=pos)
        self.vy = -500

    def update(self, dt: float) -> None:
        self.rect.y += int(self.vy * dt)
        if self.rect.bottom < 0:
            self.kill()


pygame.init()
screen = pygame.display.set_mode((640, 360))
clock = pygame.time.Clock()

player_rect = pygame.Rect(300, 300, 40, 40)
coins = pygame.sprite.Group(Coin((100, 80)), Coin((220, 120)), Coin((400, 90)))
bullets = pygame.sprite.Group()

running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
            Bullet(player_rect.midtop, bullets)

    bullets.update(dt)

    # collide player with coins; True deletes collided coin sprites
    pygame.sprite.spritecollide(type("P", (), {"rect": player_rect})(), coins, True)

    # clearer approach: iterate and kill
    for coin in coins.sprites():
        if player_rect.colliderect(coin.rect):
            coin.kill()

    screen.fill((22, 26, 34))
    pygame.draw.rect(screen, (80, 160, 220), player_rect)
    coins.draw(screen)
    bullets.draw(screen)
    pygame.display.flip()

pygame.quit()`,
      },
      {
        type: 'ul',
        items: [
          'kill() removes the sprite from all groups.',
          'spritecollide(..., dokill=True) can kill collided sprites for you.',
          'alive() returns False after kill().',
          'Hold a separate reference if you still need the object after removal.',
        ],
      },
      {
        type: 'note',
        text: 'kill() does not destroy the Python object immediately. It only detaches the sprite from groups. Garbage collection happens when no references remain.',
      },
      {
        type: 'tip',
        text: 'Prefer kill() over group.remove(sprite) when the sprite should leave every collection at once, including all_sprites and role-specific groups.',
      },
      {
        type: 'try',
        text: 'Spawn enemies that fall downward. When an enemy rect goes past the bottom of the screen, call kill(). Confirm len(enemies) drops as they leave.',
      },
      {
        type: 'keypoints',
        items: [
          'kill() removes a sprite from all of its groups.',
          'Use kill() for off-screen cleanup and collected items.',
          'Collision helpers can dokill collided sprites.',
          'Check alive() if other systems still hold a reference.',
        ],
      },
    ],
  },
  {
    slug: 'frame-animation',
    title: 'Frame Animation',
    description:
      'Cycle through a list of surfaces over time to animate idle, run, and jump frames on a sprite.',
    level: 'intermediate',
    section: 'Animation & World',
    order: 31,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Frame animation swaps self.image among a sequence of surfaces. You advance a frame index based on elapsed time so playback speed stays stable across different frame rates.',
      },
      {
        type: 'p',
        text: 'Store separate lists for idle, run, and jump. Switch the active list when state changes, and reset the index so the new clip starts cleanly.',
      },
      { type: 'h2', text: 'Animate from a list of frames' },
      {
        type: 'code',
        language: 'python',
        title: 'Animated sprite',
        code: `import pygame


def tinted_frame(color: tuple[int, int, int], size=(48, 48)) -> pygame.Surface:
    surf = pygame.Surface(size, pygame.SRCALPHA)
    surf.fill(color)
    return surf


class Hero(pygame.sprite.Sprite):
    def __init__(self, pos) -> None:
        super().__init__()
        self.frames = {
            "idle": [
                tinted_frame((70, 150, 220)),
                tinted_frame((90, 170, 235)),
            ],
            "run": [
                tinted_frame((70, 150, 220)),
                tinted_frame((60, 130, 200)),
                tinted_frame((80, 160, 230)),
                tinted_frame((60, 130, 200)),
            ],
        }
        self.state = "idle"
        self.index = 0.0
        self.fps = 8
        self.image = self.frames[self.state][0]
        self.rect = self.image.get_rect(midbottom=pos)
        self.vx = 0

    def set_state(self, name: str) -> None:
        if name != self.state:
            self.state = name
            self.index = 0.0

    def update(self, dt: float, keys) -> None:
        self.vx = 0
        if keys[pygame.K_LEFT]:
            self.vx = -200
        if keys[pygame.K_RIGHT]:
            self.vx = 200

        self.set_state("run" if self.vx else "idle")
        self.rect.x += int(self.vx * dt)

        frames = self.frames[self.state]
        self.index += self.fps * dt
        if self.index >= len(frames):
            self.index = 0.0
        self.image = frames[int(self.index)]`,
      },
      {
        type: 'ul',
        items: [
          'Keep a float index and add fps * dt each frame.',
          'Wrap with modulo or reset when the index passes the last frame.',
          'Changing clips should reset the index to avoid skipping.',
          'Preserve rect.midbottom or midcenter when frame sizes differ.',
        ],
      },
      {
        type: 'note',
        text: 'Placeholder colored surfaces are fine while learning. Later, replace tinted_frame() with frames loaded from files or sliced from a sheet.',
      },
      {
        type: 'tip',
        text: 'Store animation fps per clip if idle should breathe slowly and run should cycle faster.',
      },
      {
        type: 'try',
        text: 'Add a "blink" idle variant that plays three frames when a timer hits 2 seconds, then returns to normal idle.',
      },
      {
        type: 'keypoints',
        items: [
          'Animation is swapping image over time from a frame list.',
          'Drive playback with dt so speed is frame-rate independent.',
          'Reset the frame index when changing animation state.',
          'Anchor rect carefully if frame sizes vary.',
        ],
      },
    ],
  },
  {
    slug: 'sprite-sheets',
    title: 'Sprite Sheets',
    description:
      'Load a sprite sheet image and slice it into frames with subsurface rectangles for compact animation assets.',
    level: 'intermediate',
    section: 'Animation & World',
    order: 32,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A sprite sheet packs many frames into one image file. You load the sheet once, then cut out frames with pygame.Surface.subsurface or by blitting regions onto new surfaces.',
      },
      {
        type: 'p',
        text: 'Slicing keeps downloads small and makes it easy to keep related animations together. Know the frame width, height, and layout (rows/columns) before you cut.',
      },
      { type: 'h2', text: 'Slice a sheet into frames' },
      {
        type: 'code',
        language: 'python',
        title: 'sheet.py',
        code: `import pygame


def load_sheet(
    path: str,
    frame_w: int,
    frame_h: int,
    count: int,
    *,
    row: int = 0,
) -> list[pygame.Surface]:
    sheet = pygame.image.load(path).convert_alpha()
    frames: list[pygame.Surface] = []
    for i in range(count):
        rect = pygame.Rect(i * frame_w, row * frame_h, frame_w, frame_h)
        frame = sheet.subsurface(rect).copy()
        frames.append(frame)
    return frames


# Example: 8 frames of 32x32 on the first row
# run_frames = load_sheet("assets/hero.png", 32, 32, 8, row=0)`,
      },
      { type: 'h2', text: 'Use sliced frames on a sprite' },
      {
        type: 'code',
        language: 'python',
        title: 'Apply frames',
        code: `class Runner(pygame.sprite.Sprite):
    def __init__(self, frames: list[pygame.Surface], pos) -> None:
        super().__init__()
        self.frames = frames
        self.index = 0.0
        self.fps = 10
        self.image = self.frames[0]
        self.rect = self.image.get_rect(center=pos)
        self.facing = 1

    def update(self, dt: float) -> None:
        self.index = (self.index + self.fps * dt) % len(self.frames)
        frame = self.frames[int(self.index)]
        if self.facing < 0:
            frame = pygame.transform.flip(frame, True, False)
        self.image = frame`,
      },
      {
        type: 'ul',
        items: [
          'convert_alpha() preserves transparency for PNG sheets.',
          'copy() after subsurface avoids quirks if the sheet is unlocked later.',
          'Flip frames in code instead of storing separate left/right sheets.',
          'Document frame size in the asset filename or a small JSON sidecar.',
        ],
      },
      {
        type: 'note',
        text: 'subsurface shares pixel memory with the parent until you copy(). Copying is safer if you transform frames independently.',
      },
      {
        type: 'tip',
        text: 'If your sheet has padding between frames, include that padding in the step distance when building each Rect.',
      },
      {
        type: 'try',
        text: 'Create a 128x32 test sheet (four 32x32 colored blocks) with pygame, save it, then load and slice it with load_sheet into four frames.',
      },
      {
        type: 'keypoints',
        items: [
          'Sprite sheets store many frames in one image.',
          'Slice with Rect regions and subsurface or blit.',
          'convert_alpha() keeps transparent edges clean.',
          'Reuse one sheet loader across all animated sprites.',
        ],
      },
    ],
  },
  {
    slug: 'scrolling-bg',
    title: 'Scrolling Backgrounds',
    description:
      'Create endless or parallax scrolling backgrounds by wrapping blit positions as the camera or player moves.',
    level: 'intermediate',
    section: 'Animation & World',
    order: 33,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Scrolling backgrounds sell motion even when the level geometry is simple. The usual trick is to blit a wide image twice and wrap the offset so the seam never shows.',
      },
      {
        type: 'p',
        text: 'Parallax adds depth: far layers scroll slower than near layers. Each layer has its own scroll factor.',
      },
      { type: 'h2', text: 'Wrap a looping sky' },
      {
        type: 'code',
        language: 'python',
        title: 'scrolling_bg.py',
        code: `import pygame

pygame.init()
W, H = 800, 450
screen = pygame.display.set_mode((W, H))
clock = pygame.time.Clock()

# Wide seamless-looking strip (replace with art)
bg = pygame.Surface((W, H))
bg.fill((40, 70, 120))
for x in range(0, W, 80):
    pygame.draw.circle(bg, (70, 110, 160), (x + 40, 120), 30)

scroll = 0.0
speed = 80  # pixels per second

running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    scroll = (scroll + speed * dt) % W
    screen.blit(bg, (-scroll, 0))
    screen.blit(bg, (-scroll + W, 0))
    pygame.display.flip()

pygame.quit()`,
      },
      { type: 'h2', text: 'Simple parallax layers' },
      {
        type: 'code',
        language: 'python',
        title: 'Parallax factors',
        code: `layers = [
    {"surf": far_surf, "factor": 0.2, "x": 0.0},
    {"surf": mid_surf, "factor": 0.5, "x": 0.0},
    {"surf": near_surf, "factor": 1.0, "x": 0.0},
]

# camera_dx is how far the camera moved this frame
for layer in layers:
    layer["x"] = (layer["x"] + camera_dx * layer["factor"]) % layer["surf"].get_width()
    w = layer["surf"].get_width()
    screen.blit(layer["surf"], (-layer["x"], 0))
    screen.blit(layer["surf"], (-layer["x"] + w, 0))`,
      },
      {
        type: 'ul',
        items: [
          'Wrap scroll with modulo so the offset stays in range.',
          'Blit the strip twice to cover the seam.',
          'Lower parallax factors make distant layers drift slower.',
          'Replace generated surfaces with seamless art when you have assets.',
        ],
      },
      {
        type: 'note',
        text: 'The background image width should match the screen width for the two-blit wrap shown here. Wider images also work if you wrap with their full width.',
      },
      {
        type: 'tip',
        text: 'Draw parallax first, then world tiles and sprites, then HUD. That keeps UI sharp and unscaled by camera motion.',
      },
      {
        type: 'try',
        text: 'Add a second layer with a slower speed and a different fill color. Confirm the far layer drifts more slowly than the near layer.',
      },
      {
        type: 'keypoints',
        items: [
          'Loop backgrounds by wrapping a scroll offset.',
          'Blit the image twice to hide the wrap seam.',
          'Parallax uses different scroll factors per layer.',
          'Draw backgrounds before gameplay sprites.',
        ],
      },
    ],
  },
  {
    slug: 'camera-follow',
    title: 'Camera Follow',
    description:
      'Track the player with a camera offset so large levels can scroll while sprites stay in world coordinates.',
    level: 'intermediate',
    section: 'Animation & World',
    order: 34,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A camera is usually not a pygame object. It is an offset you subtract when drawing so the player stays near the center while the world is much larger than the window.',
      },
      {
        type: 'p',
        text: 'Keep simulation in world space. Apply the camera only at draw time. That keeps collisions simple and avoids moving every tile when the player runs.',
      },
      { type: 'h2', text: 'Follow with clamping' },
      {
        type: 'code',
        language: 'python',
        title: 'camera.py',
        code: `import pygame


class Camera:
    def __init__(self, width: int, height: int, world_w: int, world_h: int) -> None:
        self.offset = pygame.Vector2(0, 0)
        self.view_w = width
        self.view_h = height
        self.world_w = world_w
        self.world_h = world_h

    def update(self, target: pygame.Rect) -> None:
        self.offset.x = target.centerx - self.view_w // 2
        self.offset.y = target.centery - self.view_h // 2
        self.offset.x = max(0, min(self.offset.x, self.world_w - self.view_w))
        self.offset.y = max(0, min(self.offset.y, self.world_h - self.view_h))

    def apply(self, rect: pygame.Rect) -> pygame.Rect:
        return rect.move(-int(self.offset.x), -int(self.offset.y))


pygame.init()
screen = pygame.display.set_mode((800, 450))
clock = pygame.time.Clock()
WORLD_W, WORLD_H = 2400, 900
camera = Camera(800, 450, WORLD_W, WORLD_H)

player = pygame.Rect(100, 400, 40, 48)
platforms = [
    pygame.Rect(0, 500, WORLD_W, 40),
    pygame.Rect(400, 380, 160, 24),
    pygame.Rect(900, 300, 200, 24),
]

running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player.x -= int(220 * dt)
    if keys[pygame.K_RIGHT]:
        player.x += int(220 * dt)

    camera.update(player)

    screen.fill((30, 34, 42))
    for plat in platforms:
        pygame.draw.rect(screen, (90, 120, 90), camera.apply(plat))
    pygame.draw.rect(screen, (80, 170, 230), camera.apply(player))
    pygame.display.flip()

pygame.quit()`,
      },
      {
        type: 'ul',
        items: [
          'Store entities in world coordinates.',
          'camera.apply(rect) returns a screen-space rect for drawing.',
          'Clamp so the camera does not show empty space past the map.',
          'Collisions use world rects, never screen rects.',
        ],
      },
      {
        type: 'note',
        text: 'Soft follow cameras lerp toward the target each frame for a smoother feel. Start with hard centering, then ease if it feels abrupt.',
      },
      {
        type: 'tip',
        text: 'When using sprite groups, either custom-draw with camera.apply(sprite.rect) or give sprites a draw method that accepts a camera.',
      },
      {
        type: 'try',
        text: 'Add vertical movement and confirm the camera clamps at y = 0 and at world_h - view_h so you never scroll past the map.',
      },
      {
        type: 'keypoints',
        items: [
          'A camera is an offset applied at draw time.',
          'Simulate in world space; render in screen space.',
          'Clamp the offset to map bounds.',
          'Keep HUD drawn in screen coordinates without the camera.',
        ],
      },
    ],
  },
  {
    slug: 'tilemaps-intro',
    title: 'Tile Maps Intro',
    description:
      'Represent levels as grids of tile IDs, convert them into rects or sprites, and draw a tile-based world.',
    level: 'intermediate',
    section: 'Animation & World',
    order: 35,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Tile maps describe a level as a 2D grid. Each cell stores an ID: 0 for empty, 1 for solid ground, 2 for a spike, and so on. This is easier to edit and serialize than placing hundreds of rects by hand.',
      },
      {
        type: 'p',
        text: 'At load time you walk the grid, spawn collision rects or tile sprites, and optionally blit decorative tiles that have no collision.',
      },
      { type: 'h2', text: 'Build platforms from a grid' },
      {
        type: 'code',
        language: 'python',
        title: 'tilemap_basic.py',
        code: `import pygame

TILE = 32
LEVEL = [
    "....................",
    "....................",
    "........####........",
    "....................",
    "####..........####..",
    "....................",
    "####################",
]


def build_tiles(level: list[str]) -> list[pygame.Rect]:
    tiles: list[pygame.Rect] = []
    for row, line in enumerate(level):
        for col, cell in enumerate(line):
            if cell == "#":
                tiles.append(pygame.Rect(col * TILE, row * TILE, TILE, TILE))
    return tiles


pygame.init()
screen = pygame.display.set_mode((len(LEVEL[0]) * TILE, len(LEVEL) * TILE))
clock = pygame.time.Clock()
tiles = build_tiles(LEVEL)
player = pygame.Rect(64, 64, 28, 36)

running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    dx = (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * int(200 * dt)
    player.x += dx
    for tile in tiles:
        if player.colliderect(tile):
            if dx > 0:
                player.right = tile.left
            elif dx < 0:
                player.left = tile.right

    screen.fill((20, 24, 30))
    for tile in tiles:
        pygame.draw.rect(screen, (100, 140, 100), tile)
    pygame.draw.rect(screen, (90, 180, 240), player)
    pygame.display.flip()

pygame.quit()`,
      },
      {
        type: 'ul',
        items: [
          'Strings or nested lists both work as authoring formats.',
          'Multiply grid indices by TILE to get pixel positions.',
          'Keep a mapping from character or ID to behavior.',
          'Decorative tiles can skip the collision list.',
        ],
      },
      {
        type: 'note',
        text: 'For large maps, store only solid tiles for collision. Drawing can still blit from a full grid or a pre-rendered map surface.',
      },
      {
        type: 'tip',
        text: 'Start with ASCII maps in Python lists. Move to CSV or JSON when designers need an external editor.',
      },
      {
        type: 'try',
        text: 'Add a "^" tile that draws in red and, on collide, prints "ouch" and nudges the player upward.',
      },
      {
        type: 'keypoints',
        items: [
          'Tile maps store levels as grids of IDs or characters.',
          'Convert cells to pixel rects with a tile size.',
          'Separate visual tiles from solid collision tiles when useful.',
          'ASCII maps are a fast way to prototype layouts.',
        ],
      },
    ],
  },
  {
    slug: 'load-level-data',
    title: 'Loading Levels From Data',
    description:
      'Load level layouts from JSON or text files so you can edit maps without changing game code.',
    level: 'intermediate',
    section: 'Animation & World',
    order: 36,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Hard-coded level arrays are fine for demos. Real projects load maps from data files so you can add stages without redeploying logic.',
      },
      {
        type: 'p',
        text: 'JSON is a comfortable format in Python: rows of tile IDs, a tile size, and optional spawn points for the player and enemies.',
      },
      { type: 'h2', text: 'Example level file' },
      {
        type: 'code',
        language: 'python',
        title: 'levels/level1.json (contents)',
        code: `{
  "tile_size": 32,
  "player_spawn": [64, 320],
  "rows": [
    "....................",
    "....................",
    "........####........",
    "..............E.....",
    "####..........####..",
    "....................",
    "####################"
  ]
}`,
      },
      { type: 'h2', text: 'Parse and spawn' },
      {
        type: 'code',
        language: 'python',
        title: 'load_level.py',
        code: `import json
from pathlib import Path
import pygame


def load_level(path: str) -> dict:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    tile = data["tile_size"]
    solids: list[pygame.Rect] = []
    enemies: list[tuple[int, int]] = []

    for row, line in enumerate(data["rows"]):
        for col, cell in enumerate(line):
            x, y = col * tile, row * tile
            if cell == "#":
                solids.append(pygame.Rect(x, y, tile, tile))
            elif cell == "E":
                enemies.append((x + tile // 2, y + tile))

    spawn = tuple(data["player_spawn"])
    return {
        "tile_size": tile,
        "solids": solids,
        "enemies": enemies,
        "player_spawn": spawn,
        "pixel_size": (len(data["rows"][0]) * tile, len(data["rows"]) * tile),
    }


level = load_level("levels/level1.json")
print(level["player_spawn"], len(level["solids"]), level["enemies"])`,
      },
      {
        type: 'ul',
        items: [
          'Keep code responsible for rules; keep files responsible for layout.',
          'Validate that all rows are the same length when loading.',
          'Store spawns explicitly instead of scanning for a "P" if you prefer.',
          'One loader can support many stage files.',
        ],
      },
      {
        type: 'note',
        text: 'Path.read_text and json.loads fail loudly on bad files. Catch errors at the menu or boot screen and show a clear message.',
      },
      {
        type: 'tip',
        text: 'Version your level format with a "version" field so future loaders can migrate old maps.',
      },
      {
        type: 'try',
        text: 'Write level2.json with a different layout, load it with the same function, and print the solid count for both files.',
      },
      {
        type: 'keypoints',
        items: [
          'External level data separates content from code.',
          'JSON maps can include rows, tile size, and spawns.',
          'Convert file data into rects and entity positions at load time.',
          'Reuse one loader for every stage in the game.',
        ],
      },
    ],
  },
  {
    slug: 'gravity-platforms',
    title: 'Gravity and Platforms',
    description:
      'Apply gravity with vertical velocity and resolve landing on solid platform rects for a basic platformer body.',
    level: 'intermediate',
    section: 'Platformer Skills',
    order: 37,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Platformer movement usually tracks velocity. Gravity adds to vy each frame. After moving on y, you resolve collisions so the player rests on platforms instead of falling through.',
      },
      {
        type: 'p',
        text: 'Separating x and y movement makes collision response much easier. Move on one axis, fix overlaps, then do the other axis.',
      },
      { type: 'h2', text: 'Gravity with axis-separated collision' },
      {
        type: 'code',
        language: 'python',
        title: 'gravity_platforms.py',
        code: `import pygame

GRAVITY = 1600
MAX_FALL = 900
MOVE_SPEED = 220

pygame.init()
screen = pygame.display.set_mode((800, 450))
clock = pygame.time.Clock()

player = pygame.Rect(80, 80, 32, 40)
vel = pygame.Vector2(0, 0)
platforms = [
    pygame.Rect(0, 400, 800, 50),
    pygame.Rect(200, 320, 160, 20),
    pygame.Rect(420, 250, 140, 20),
]


def move_and_collide(rect: pygame.Rect, dx: float, dy: float, tiles: list[pygame.Rect]):
    rect.x += int(dx)
    for tile in tiles:
        if rect.colliderect(tile):
            if dx > 0:
                rect.right = tile.left
            elif dx < 0:
                rect.left = tile.right

    rect.y += int(dy)
    on_ground = False
    for tile in tiles:
        if rect.colliderect(tile):
            if dy > 0:
                rect.bottom = tile.top
                on_ground = True
            elif dy < 0:
                rect.top = tile.bottom
                dy = 0
    return on_ground


running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    vel.x = (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * MOVE_SPEED
    vel.y = min(vel.y + GRAVITY * dt, MAX_FALL)

    on_ground = move_and_collide(player, vel.x * dt, vel.y * dt, platforms)
    if on_ground:
        vel.y = 0

    screen.fill((24, 28, 36))
    for p in platforms:
        pygame.draw.rect(screen, (90, 130, 90), p)
    pygame.draw.rect(screen, (80, 170, 230), player)
    pygame.display.flip()

pygame.quit()`,
      },
      {
        type: 'ul',
        items: [
          'Gravity is acceleration: vy += GRAVITY * dt.',
          'Clamp fall speed so long falls stay controllable.',
          'Resolve x and y separately against solids.',
          'Zero vy when landing so gravity does not accumulate underground.',
        ],
      },
      {
        type: 'note',
        text: 'Integer pixel positions can jitter on slopes or thin platforms. For now, flat rect platforms keep learning focused on the core response.',
      },
      {
        type: 'tip',
        text: 'Store on_ground from the y collision pass. Jumping and animation both need that flag next.',
      },
      {
        type: 'try',
        text: 'Add a floating platform rect and confirm the player can land on it and walk off the edge into a fall.',
      },
      {
        type: 'keypoints',
        items: [
          'Use velocity and gravity for platformer falls.',
          'Move and collide one axis at a time.',
          'Landing sets on_ground and clears vertical velocity.',
          'MAX_FALL keeps high-speed tunneling less severe.',
        ],
      },
    ],
  },
  {
    slug: 'jumping',
    title: 'Jumping and Grounded State',
    description:
      'Implement jumps that only start when grounded, with coyote time and jump buffering as optional feel upgrades.',
    level: 'intermediate',
    section: 'Platformer Skills',
    order: 38,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A jump sets vertical velocity upward when the player is grounded. Tracking on_ground carefully prevents infinite air jumps unless you design double-jump rules on purpose.',
      },
      {
        type: 'p',
        text: 'Small timing helpers - coyote time and jump buffer - make controls feel fair. Coyote time allows a jump shortly after walking off a ledge. A buffer remembers an early jump press until landing.',
      },
      { type: 'h2', text: 'Grounded jump with coyote time' },
      {
        type: 'code',
        language: 'python',
        title: 'jumping.py',
        code: `import pygame

GRAVITY = 1700
JUMP_SPEED = -520
COYOTE = 0.08
BUFFER = 0.1

player = pygame.Rect(100, 100, 32, 40)
vel_y = 0.0
on_ground = False
coyote_t = 0.0
buffer_t = 0.0


def try_jump() -> None:
    global vel_y, coyote_t, buffer_t
    if coyote_t > 0:
        vel_y = JUMP_SPEED
        coyote_t = 0
        buffer_t = 0
        # on_ground becomes false next collision pass


# inside the loop after collisions:
# if on_ground:
#     coyote_t = COYOTE
# else:
#     coyote_t = max(0.0, coyote_t - dt)
#
# if buffer_t > 0:
#     buffer_t = max(0.0, buffer_t - dt)
#     try_jump()
#
# on KEYDOWN Space:
#     buffer_t = BUFFER
#     try_jump()`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'Minimal jump without helpers',
        code: `if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
    if on_ground:
        vel_y = JUMP_SPEED
        on_ground = False`,
      },
      {
        type: 'ul',
        items: [
          'Negative vy moves up when y grows downward.',
          'Only jump when grounded (or within coyote time).',
          'Variable jump height can cut vy when Space is released early.',
          'Play a jump sound or switch to a jump animation on the impulse.',
        ],
      },
      {
        type: 'note',
        text: 'If jump feels floaty, raise gravity and jump speed together. If it feels stiff, lower gravity slightly or increase JUMP_SPEED.',
      },
      {
        type: 'tip',
        text: 'Read jump requests from KEYDOWN events, not get_pressed, so one press equals one jump attempt.',
      },
      {
        type: 'try',
        text: 'Implement variable jump height: while rising, if Space is not held, set vel_y = max(vel_y, JUMP_SPEED * 0.4).',
      },
      {
        type: 'keypoints',
        items: [
          'Jumps apply an upward velocity impulse.',
          'Gate jumps with an on_ground (or coyote) check.',
          'Coyote time and buffers improve control feel.',
          'Use KEYDOWN for discrete jump presses.',
        ],
      },
    ],
  },
  {
    slug: 'better-collisions',
    title: 'Better Collision Responses',
    description:
      'Improve platformer collisions with one-way platforms, head bumps, and safer ordering against multiple tiles.',
    level: 'intermediate',
    section: 'Platformer Skills',
    order: 39,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Basic axis separation works for solid blocks. Intermediate platformers add one-way platforms, ceiling bumps that cancel upward velocity, and careful sorting when several tiles overlap the player in one frame.',
      },
      {
        type: 'p',
        text: 'One-way platforms only collide when the player is falling and was above the platform. That lets you jump up through a ledge and land on the way down.',
      },
      { type: 'h2', text: 'One-way platform test' },
      {
        type: 'code',
        language: 'python',
        title: 'one_way.py',
        code: `def collide_one_way(
    player: pygame.Rect,
    prev_bottom: int,
    dy: float,
    platform: pygame.Rect,
) -> bool:
    if dy <= 0:
        return False
    if prev_bottom > platform.top:
        return False
    return player.colliderect(platform)


def resolve_y(player: pygame.Rect, dy: float, solids, one_ways, vel_y: float):
    prev_bottom = player.bottom
    player.y += int(dy)
    on_ground = False

    for tile in solids:
        if player.colliderect(tile):
            if dy > 0:
                player.bottom = tile.top
                on_ground = True
                vel_y = 0
            elif dy < 0:
                player.top = tile.bottom
                vel_y = 0  # head bump

    for tile in one_ways:
        if collide_one_way(player, prev_bottom, dy, tile):
            player.bottom = tile.top
            on_ground = True
            vel_y = 0

    return on_ground, vel_y`,
      },
      {
        type: 'ul',
        items: [
          'Store previous bottom to know if you crossed a ledge from above.',
          'Cancel vel_y on ceiling hits so the player starts falling.',
          'Test solids before decorative or trigger tiles.',
          'For many tiles, a spatial hash or tile grid query beats scanning everything.',
        ],
      },
      {
        type: 'note',
        text: 'Floating point dt can skip thin floors at high speeds. Clamp max fall speed and keep platforms at least a few pixels thick.',
      },
      {
        type: 'tip',
        text: 'Draw collision rects in a debug color behind sprites when tuning. Visualizing hitboxes saves hours of guesswork.',
      },
      {
        type: 'try',
        text: 'Add a one-way platform above the ground. Jump through it from below, land on top, then walk off the edge.',
      },
      {
        type: 'keypoints',
        items: [
          'One-way platforms collide only on downward crossings.',
          'Ceiling bumps should zero upward velocity.',
          'Previous frame bounds help decide valid landings.',
          'Debug draw collision rects while tuning.',
        ],
      },
    ],
  },
  {
    slug: 'enemy-patrol',
    title: 'Simple Enemy Patrol',
    description:
      'Build enemies that walk back and forth between points or edges, flipping direction on walls and ledges.',
    level: 'intermediate',
    section: 'Platformer Skills',
    order: 40,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A patrol enemy is a sprite with horizontal speed that turns around at waypoints, solid walls, or platform edges. It adds threat without complex AI.',
      },
      {
        type: 'p',
        text: 'Edge detection casts a small sensor rect past the front foot. If that sensor is not overlapping ground, the enemy turns before walking off.',
      },
      { type: 'h2', text: 'Patrol between bounds' },
      {
        type: 'code',
        language: 'python',
        title: 'enemy_patrol.py',
        code: `import pygame


class PatrolEnemy(pygame.sprite.Sprite):
    def __init__(self, x: int, y: int, left_bound: int, right_bound: int) -> None:
        super().__init__()
        self.image = pygame.Surface((36, 36))
        self.image.fill((200, 90, 90))
        self.rect = self.image.get_rect(midbottom=(x, y))
        self.speed = 90
        self.direction = 1
        self.left_bound = left_bound
        self.right_bound = right_bound

    def update(self, dt: float) -> None:
        self.rect.x += int(self.speed * self.direction * dt)
        if self.rect.left <= self.left_bound:
            self.rect.left = self.left_bound
            self.direction = 1
        elif self.rect.right >= self.right_bound:
            self.rect.right = self.right_bound
            self.direction = -1


class EdgeAwareEnemy(pygame.sprite.Sprite):
    def __init__(self, pos, platforms: list[pygame.Rect]) -> None:
        super().__init__()
        self.image = pygame.Surface((36, 36))
        self.image.fill((210, 110, 80))
        self.rect = self.image.get_rect(midbottom=pos)
        self.platforms = platforms
        self.direction = 1
        self.speed = 100

    def _ground_ahead(self) -> bool:
        foot = pygame.Rect(0, 0, 6, 8)
        if self.direction > 0:
            foot.topleft = (self.rect.right, self.rect.bottom)
        else:
            foot.topright = (self.rect.left, self.rect.bottom)
        return any(foot.colliderect(p) for p in self.platforms)

    def update(self, dt: float) -> None:
        self.rect.x += int(self.speed * self.direction * dt)
        for p in self.platforms:
            if self.rect.colliderect(p):
                if self.direction > 0:
                    self.rect.right = p.left
                else:
                    self.rect.left = p.right
                self.direction *= -1
                return
        if not self._ground_ahead():
            self.direction *= -1`,
      },
      {
        type: 'ul',
        items: [
          'Store direction as 1 or -1 and multiply into speed.',
          'Turn at explicit bounds or when a wall/ledge sensor fires.',
          'Keep patrol logic inside Enemy.update(dt).',
          'Author bounds in level data next to enemy spawn points.',
        ],
      },
      {
        type: 'note',
        text: 'Bounds-based patrol is predictable and easy to place in level data. Edge-aware patrol adapts to platform shapes without per-enemy numbers.',
      },
      {
        type: 'tip',
        text: 'Flip the enemy image when direction changes so art faces the walk direction.',
      },
      {
        type: 'try',
        text: 'Spawn two PatrolEnemy instances on different platforms with different bounds. Confirm they turn independently.',
      },
      {
        type: 'keypoints',
        items: [
          'Patrol AI flips direction at bounds, walls, or edges.',
          'A foot sensor detects ledges before a fall.',
          'Keep enemy movement in update(dt).',
          'Level data can supply left/right patrol bounds.',
        ],
      },
    ],
  },
  {
    slug: 'health-damage',
    title: 'Health and Damage',
    description:
      'Track hit points, apply damage with invulnerability frames, and react when health reaches zero.',
    level: 'intermediate',
    section: 'Platformer Skills',
    order: 41,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Health is an integer (or float) on the player or enemy. Damage subtracts from it. Invulnerability frames (i-frames) prevent the same collision from draining HP every frame.',
      },
      {
        type: 'p',
        text: 'When health hits zero, trigger a death state: play an animation, pause control, and eventually restart the level or show game over.',
      },
      { type: 'h2', text: 'Damage with i-frames' },
      {
        type: 'code',
        language: 'python',
        title: 'health.py',
        code: `import pygame


class Player(pygame.sprite.Sprite):
    def __init__(self, pos) -> None:
        super().__init__()
        self.image = pygame.Surface((32, 40))
        self.image.fill((80, 170, 230))
        self.rect = self.image.get_rect(midbottom=pos)
        self.max_hp = 3
        self.hp = self.max_hp
        self.iframes = 0.0
        self.alive = True

    def hurt(self, amount: int = 1) -> None:
        if self.iframes > 0 or not self.alive:
            return
        self.hp -= amount
        self.iframes = 1.0  # one second of invulnerability
        if self.hp <= 0:
            self.hp = 0
            self.alive = False

    def update(self, dt: float) -> None:
        if self.iframes > 0:
            self.iframes = max(0.0, self.iframes - dt)
            # optional blink: hide image half the time
            if int(self.iframes * 10) % 2 == 0:
                self.image.set_alpha(80)
            else:
                self.image.set_alpha(255)
        else:
            self.image.set_alpha(255)


def resolve_enemy_touch(player: Player, enemies: pygame.sprite.Group) -> None:
    for enemy in enemies:
        if player.rect.colliderect(enemy.rect):
            player.hurt(1)
            # optional knockback:
            # player.rect.x += -20 if player.rect.centerx < enemy.rect.centerx else 20
            break`,
      },
      {
        type: 'ul',
        items: [
          'Clamp hp to 0..max_hp when healing or damaging.',
          'i-frames stop rapid multi-hits from overlapping enemies.',
          'Blink or flash the sprite while iframes > 0.',
          'Enemies can use the same pattern with smaller hp pools.',
        ],
      },
      {
        type: 'note',
        text: 'Contact damage should usually run once per contact after i-frames, not once per overlapping pixel test without a cooldown.',
      },
      {
        type: 'tip',
        text: 'Centralize hurt() so pickups, hazards, and enemy AI all go through one path that handles death consistently.',
      },
      {
        type: 'try',
        text: 'Add a health pickup sprite that calls a heal(1) method and kills itself. Refuse healing while hp is already at max_hp.',
      },
      {
        type: 'keypoints',
        items: [
          'Store hp and max_hp on combat actors.',
          'Use invulnerability timers after hits.',
          'Route damage through a single hurt() method.',
          'Zero hp triggers death handling in game flow.',
        ],
      },
    ],
  },
  {
    slug: 'hud-ui',
    title: 'HUD and UI Overlays',
    description:
      'Draw health, score, and messages in screen space above the world so the HUD stays fixed while the camera moves.',
    level: 'intermediate',
    section: 'Platformer Skills',
    order: 42,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'The HUD (heads-up display) shows health, score, lives, and objectives. Draw it after the world, in screen coordinates, so camera scrolling never moves the bars.',
      },
      {
        type: 'p',
        text: 'Keep HUD data on a small object or in the game state. Sprites can emit score events; the HUD reads the current numbers each frame.',
      },
      { type: 'h2', text: 'Draw hearts and score' },
      {
        type: 'code',
        language: 'python',
        title: 'hud.py',
        code: `import pygame


class HUD:
    def __init__(self) -> None:
        self.font = pygame.font.SysFont("consolas", 22)
        self.score = 0

    def add_score(self, amount: int) -> None:
        self.score += amount

    def draw(self, screen: pygame.Surface, hp: int, max_hp: int) -> None:
        # health pips
        for i in range(max_hp):
            color = (220, 70, 70) if i < hp else (60, 60, 70)
            pygame.draw.rect(screen, color, pygame.Rect(16 + i * 28, 16, 22, 18), border_radius=4)

        label = self.font.render(f"Score {self.score}", True, (240, 240, 240))
        screen.blit(label, (16, 48))


# in the main loop, after world draw:
# hud.draw(screen, player.hp, player.max_hp)`,
      },
      {
        type: 'ul',
        items: [
          'Initialize fonts once, not every frame.',
          'Draw HUD last so it sits above gameplay.',
          'Use screen space (origin top-left of the window).',
          'Dim the world with a translucent overlay for pause menus later.',
        ],
      },
      {
        type: 'note',
        text: 'SysFont depends on fonts installed on the machine. For shipping games, bundle a .ttf and load it with pygame.font.Font.',
      },
      {
        type: 'tip',
        text: 'Cache rendered score surfaces and only re-render when the number changes if you need every bit of performance.',
      },
      {
        type: 'try',
        text: 'Show a temporary "+100" floating label for one second after collecting a coin by tracking a short-lived timer and alpha.',
      },
      {
        type: 'keypoints',
        items: [
          'HUD draws in screen space after the world.',
          'Reuse font objects across frames.',
          'Read hp and score from game state each frame.',
          'Bundle font files for portable builds.',
        ],
      },
    ],
  },
  {
    slug: 'game-states',
    title: 'Menus and Game States',
    description:
      'Structure the app as menu, play, and other states so input and drawing stay organized as the project grows.',
    level: 'intermediate',
    section: 'Game Flow',
    order: 43,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A game state machine keeps title screens, gameplay, and credits from mixing in one giant loop. Each state handles its own events, updates, and draws.',
      },
      {
        type: 'p',
        text: 'The main loop only asks the current state to run. Transitions return the next state object (or a string key) when the player starts a run or exits to the menu.',
      },
      { type: 'h2', text: 'Simple state objects' },
      {
        type: 'code',
        language: 'python',
        title: 'states.py',
        code: `import pygame


class MenuState:
    def __init__(self) -> None:
        self.font = pygame.font.SysFont("consolas", 36)

    def handle_event(self, event: pygame.event.Event):
        if event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN:
            return PlayState()
        return self

    def update(self, dt: float):
        return self

    def draw(self, screen: pygame.Surface) -> None:
        screen.fill((18, 20, 28))
        text = self.font.render("Press Enter to Play", True, (230, 230, 230))
        screen.blit(text, text.get_rect(center=(400, 225)))


class PlayState:
    def __init__(self) -> None:
        self.player = pygame.Rect(100, 300, 32, 40)

    def handle_event(self, event: pygame.event.Event):
        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            return MenuState()
        return self

    def update(self, dt: float):
        keys = pygame.key.get_pressed()
        self.player.x += (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * int(220 * dt)
        return self

    def draw(self, screen: pygame.Surface) -> None:
        screen.fill((24, 28, 36))
        pygame.draw.rect(screen, (80, 170, 230), self.player)


pygame.init()
screen = pygame.display.set_mode((800, 450))
clock = pygame.time.Clock()
state = MenuState()

running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        else:
            state = state.handle_event(event) or state

    state = state.update(dt) or state
    state.draw(screen)
    pygame.display.flip()

pygame.quit()`,
      },
      {
        type: 'ul',
        items: [
          'Each state implements handle_event, update, and draw.',
          'Return a new state instance to transition.',
          'Keep shared assets in a context object if many states need them.',
          'Reset play state when starting a new run so leftover enemies disappear.',
        ],
      },
      {
        type: 'note',
        text: 'You can also use string keys and a dictionary of factories. Object-per-state is easier to read for intermediate projects.',
      },
      {
        type: 'tip',
        text: 'Disable gameplay timers when leaving PlayState so enemies do not keep spawning into a dead state.',
      },
      {
        type: 'try',
        text: 'Add a SettingsState reachable from the menu with S. Press Esc inside settings to return to MenuState.',
      },
      {
        type: 'keypoints',
        items: [
          'Game states separate menu and gameplay logic.',
          'The main loop delegates to the active state.',
          'Transitions return the next state object.',
          'Create a fresh PlayState for each new run.',
        ],
      },
    ],
  },
  {
    slug: 'pause-gameover',
    title: 'Pause and Game Over',
    description:
      'Add pause overlays and game-over handling that freeze gameplay while still drawing the world underneath.',
    level: 'intermediate',
    section: 'Game Flow',
    order: 44,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Pause stops updates but can keep drawing the last world frame under a dim overlay. Game over similarly freezes control and offers retry or menu actions.',
      },
      {
        type: 'p',
        text: 'You can model these as flags inside PlayState or as separate states. Flags are quick; separate states scale better when pause has its own menu widgets.',
      },
      { type: 'h2', text: 'Pause flag inside play' },
      {
        type: 'code',
        language: 'python',
        title: 'pause_and_game_over.py',
        code: `import pygame


class PlayState:
    def __init__(self) -> None:
        self.font = pygame.font.SysFont("consolas", 32)
        self.player_hp = 3
        self.paused = False
        self.game_over = False
        self.player = pygame.Rect(120, 300, 32, 40)

    def handle_event(self, event: pygame.event.Event):
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_p and not self.game_over:
                self.paused = not self.paused
            if self.game_over and event.key == pygame.K_r:
                return PlayState()  # retry
            if self.game_over and event.key == pygame.K_ESCAPE:
                return "menu"
        return self

    def update(self, dt: float):
        if self.paused or self.game_over:
            return self
        # ... normal gameplay ...
        if self.player_hp <= 0:
            self.game_over = True
        return self

    def draw(self, screen: pygame.Surface) -> None:
        screen.fill((24, 28, 36))
        pygame.draw.rect(screen, (80, 170, 230), self.player)

        if self.paused or self.game_over:
            overlay = pygame.Surface(screen.get_size(), pygame.SRCALPHA)
            overlay.fill((0, 0, 0, 140))
            screen.blit(overlay, (0, 0))
            msg = "Paused (P)" if self.paused else "Game Over - R retry, Esc menu"
            text = self.font.render(msg, True, (255, 255, 255))
            screen.blit(text, text.get_rect(center=screen.get_rect().center))`,
      },
      {
        type: 'ul',
        items: [
          'Skip gameplay updates while paused or on game over.',
          'Still draw the world, then a translucent overlay.',
          'Retry by constructing a new PlayState.',
          'Stop custom timers when paused if they should not advance.',
        ],
      },
      {
        type: 'note',
        text: 'If music should duck or pause, hook that into the same flag that freezes gameplay so audio and logic stay in sync.',
      },
      {
        type: 'tip',
        text: 'Ignore jump and move keys while paused by returning early from update, but still allow P or Esc in handle_event.',
      },
      {
        type: 'try',
        text: 'When the player dies, wait 0.5 seconds before accepting R so a leftover key press does not instantly restart.',
      },
      {
        type: 'keypoints',
        items: [
          'Pause freezes updates and shows an overlay.',
          'Game over reuses the overlay pattern with retry options.',
          'Rebuild PlayState to reset a run cleanly.',
          'Keep pause input available even when gameplay input is blocked.',
        ],
      },
    ],
  },
  {
    slug: 'constants-config',
    title: 'Constants and Config',
    description:
      'Centralize screen size, speeds, colors, and paths in a config module so tuning does not require hunting through files.',
    level: 'intermediate',
    section: 'Game Flow',
    order: 45,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Magic numbers scattered across sprites make balancing painful. A config module (or dataclass) holds WIDTH, HEIGHT, GRAVITY, paths, and palette values in one place.',
      },
      {
        type: 'p',
        text: 'As projects grow, you can load overrides from a JSON file for quick tweaks without editing Python.',
      },
      { type: 'h2', text: 'A clean config module' },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"


@dataclass(frozen=True)
class Settings:
    width: int = 800
    height: int = 450
    fps: int = 60
    title: str = "Platformer"
    gravity: float = 1700
    player_speed: float = 220
    jump_speed: float = -520
    bg_color: tuple[int, int, int] = (24, 28, 36)
    player_color: tuple[int, int, int] = (80, 170, 230)


SETTINGS = Settings()


def asset(name: str) -> Path:
    return ASSETS / name`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'Using settings',
        code: `import pygame
from settings import SETTINGS, asset

pygame.init()
screen = pygame.display.set_mode((SETTINGS.width, SETTINGS.height))
pygame.display.set_caption(SETTINGS.title)
clock = pygame.time.Clock()

# hero = pygame.image.load(asset("hero.png")).convert_alpha()

# in update:
# vel.y += SETTINGS.gravity * dt
# speed = SETTINGS.player_speed`,
      },
      {
        type: 'ul',
        items: [
          'frozen=True dataclasses prevent accidental edits at runtime.',
          'Keep asset paths relative to the project root.',
          'Group related constants (physics, UI, audio) with comments or nested objects.',
          'Prefer names over raw literals in gameplay code.',
        ],
      },
      {
        type: 'note',
        text: 'Constants that change per level (map file, spawn) belong in level data. Constants that define the game feel belong in settings.',
      },
      {
        type: 'tip',
        text: 'When a playtest note says "jump feels weak", change one JUMP_SPEED value instead of searching every file for -520.',
      },
      {
        type: 'try',
        text: 'Move WIDTH, HEIGHT, and GRAVITY from your main file into settings.py and import SETTINGS everywhere those values were used.',
      },
      {
        type: 'keypoints',
        items: [
          'Centralize tunables in a settings module.',
          'Use paths anchored to the project root for assets.',
          'Level content stays in data files; feel stays in config.',
          'Named constants make balancing and reviews easier.',
        ],
      },
    ],
  },
  {
    slug: 'gamepad-input',
    title: 'Gamepad Basics',
    description:
      'Read joysticks and controllers with pygame.joystick for movement axes and button presses alongside the keyboard.',
    level: 'intermediate',
    section: 'Game Flow',
    order: 46,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Pygame exposes controllers through pygame.joystick. After init, you can read axis values for movement and button states for jump, pause, and attack.',
      },
      {
        type: 'p',
        text: 'Always keep keyboard controls working. Treat the gamepad as an additional input source that writes into the same move_x and jump_pressed values.',
      },
      { type: 'h2', text: 'Initialize and read a pad' },
      {
        type: 'code',
        language: 'python',
        title: 'gamepad.py',
        code: `import pygame

pygame.init()
pygame.joystick.init()

screen = pygame.display.set_mode((640, 360))
clock = pygame.time.Clock()

pad = None
if pygame.joystick.get_count() > 0:
    pad = pygame.joystick.Joystick(0)
    pad.init()
    print("Using", pad.get_name())


def read_move() -> tuple[float, bool]:
    keys = pygame.key.get_pressed()
    move_x = float(keys[pygame.K_RIGHT] - keys[pygame.K_LEFT])
    jump = False

    if pad is not None:
        axis_x = pad.get_axis(0)
        deadzone = 0.25
        if abs(axis_x) > deadzone:
            move_x = axis_x
        # button indices vary by controller; 0 is often south face (A / Cross)
        if pad.get_button(0):
            jump = True

    if keys[pygame.K_SPACE]:
        jump = True
    return move_x, jump


player = pygame.Rect(300, 200, 40, 40)
running = True
while running:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.JOYDEVICEADDED:
            pad = pygame.joystick.Joystick(event.device_index)
            pad.init()
        elif event.type == pygame.JOYDEVICEREMOVED:
            pad = None

    move_x, jump_held = read_move()
    player.x += int(move_x * 260 * dt)

    screen.fill((20, 24, 32))
    pygame.draw.rect(screen, (90, 200, 140), player)
    pygame.display.flip()

pygame.quit()`,
      },
      {
        type: 'ul',
        items: [
          'Call pygame.joystick.init() before querying devices.',
          'Apply a deadzone so stick drift does not move the player.',
          'Handle hotplug with JOYDEVICEADDED and JOYDEVICEREMOVED.',
          'Map actions (jump, pause) instead of hard-coding buttons in every sprite.',
        ],
      },
      {
        type: 'note',
        text: 'Axis and button indices differ across controllers. For production, consider pygame Controllers API or a small remap table per device name.',
      },
      {
        type: 'tip',
        text: 'For jump, prefer JOYBUTTONDOWN events so holding the button does not retrigger every frame without your consent.',
      },
      {
        type: 'try',
        text: 'Print pad.get_numaxes() and pad.get_numbuttons() for your controller. Move the stick and watch axis 0 and 1 values in the console.',
      },
      {
        type: 'keypoints',
        items: [
          'pygame.joystick reads axes and buttons.',
          'Use a deadzone on analog sticks.',
          'Merge gamepad and keyboard into shared actions.',
          'Support connect/disconnect events when possible.',
        ],
      },
    ],
  },
  {
    slug: 'platformer-project',
    title: 'Intermediate Project: Platformer',
    description:
      'Combine sprites, camera, tiles, gravity, enemies, health, and game states into a small playable platformer.',
    level: 'intermediate',
    section: 'Game Flow',
    order: 47,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'This project stitches the intermediate skills into one game loop: load a level, spawn a player and patrol enemies, scroll a camera, track health, and return to a menu on death or escape.',
      },
      {
        type: 'p',
        text: 'Keep files small: settings.py, level loading, sprites, states, and main.py. Finish a vertical slice before polishing art.',
      },
      { type: 'h2', text: 'Suggested file layout' },
      {
        type: 'ul',
        items: [
          'settings.py - screen size, gravity, speeds',
          'level.py - load JSON/ASCII maps into rects and spawns',
          'sprites.py - Player, Enemy, Coin sprite classes',
          'states.py - MenuState and PlayState',
          'main.py - init, loop, quit',
        ],
      },
      { type: 'h2', text: 'PlayState skeleton' },
      {
        type: 'code',
        language: 'python',
        title: 'PlayState core',
        code: `import pygame
from settings import SETTINGS
from level import load_level
from sprites import Player, PatrolEnemy, Coin


class PlayState:
    def __init__(self, level_path: str = "levels/level1.json") -> None:
        data = load_level(level_path)
        self.solids = data["solids"]
        self.world_w, self.world_h = data["pixel_size"]
        self.coins = pygame.sprite.Group(
            *(Coin(pos) for pos in data.get("coins", []))
        )
        self.enemies = pygame.sprite.Group(
            *(
                PatrolEnemy(pos, data["patrol_bounds"][i])
                for i, pos in enumerate(data["enemies"])
            )
        )
        self.player = Player(data["player_spawn"])
        self.camera = pygame.Vector2(0, 0)
        self.hud_score = 0
        self.paused = False
        self.dead = False

    def handle_event(self, event: pygame.event.Event):
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                return "menu"
            if event.key == pygame.K_p:
                self.paused = not self.paused
            if event.key == pygame.K_SPACE:
                self.player.request_jump()
            if self.dead and event.key == pygame.K_r:
                return PlayState()
        return self

    def update(self, dt: float):
        if self.paused or self.dead:
            return self
        keys = pygame.key.get_pressed()
        self.player.update(dt, keys, self.solids)
        self.enemies.update(dt)
        for coin in pygame.sprite.spritecollide(self.player, self.coins, True):
            self.hud_score += 100
        for enemy in self.enemies:
            if self.player.rect.colliderect(enemy.rect):
                self.player.hurt()
        if not self.player.alive:
            self.dead = True
        self.camera.x = max(
            0,
            min(
                self.player.rect.centerx - SETTINGS.width // 2,
                self.world_w - SETTINGS.width,
            ),
        )
        self.camera.y = max(
            0,
            min(
                self.player.rect.centery - SETTINGS.height // 2,
                self.world_h - SETTINGS.height,
            ),
        )
        return self

    def _apply(self, rect: pygame.Rect) -> pygame.Rect:
        return rect.move(-int(self.camera.x), -int(self.camera.y))

    def draw(self, screen: pygame.Surface) -> None:
        screen.fill(SETTINGS.bg_color)
        for solid in self.solids:
            pygame.draw.rect(screen, (90, 130, 90), self._apply(solid))
        for sprite in (*self.coins, *self.enemies):
            screen.blit(sprite.image, self._apply(sprite.rect))
        screen.blit(self.player.image, self._apply(self.player.rect))
        font = pygame.font.SysFont("consolas", 20)
        hud = font.render(
            f"HP {self.player.hp}  Score {self.hud_score}",
            True,
            (240, 240, 240),
        )
        screen.blit(hud, (12, 10))
        if self.paused or self.dead:
            msg = "Paused" if self.paused else "Game Over - R to retry"
            text = font.render(msg, True, (255, 255, 255))
            screen.blit(text, text.get_rect(center=screen.get_rect().center))`,
      },
      {
        type: 'ul',
        items: [
          'Goal: reach the end of the map or collect all coins without losing all HP.',
          'Use one level file first; add level2 only after the loop feels solid.',
          'Keep collisions in world space and apply the camera only when drawing.',
          'Wire MenuState Enter key to return PlayState().',
        ],
      },
      {
        type: 'note',
        text: 'A vertical slice beats a half-finished epic. Ship menu, one level, death, and retry before adding double jumps or bosses.',
      },
      {
        type: 'tip',
        text: 'If something feels wrong, toggle debug drawing of solids and enemy patrol bounds for a few runs.',
      },
      {
        type: 'try',
        text: 'Finish the project with at least three coins, two patrol enemies, jump + gravity, camera follow, pause, and retry on death.',
      },
      {
        type: 'keypoints',
        items: [
          'Combine sprites, tiles, camera, combat, and states into one loop.',
          'Split modules so each file has a clear job.',
          'Simulate in world space; draw with a camera offset.',
          'Prefer a complete small game over scattered half-features.',
        ],
      },
    ],
  },
  {
    slug: 'intermediate-review',
    title: 'Intermediate Review',
    description:
      'Review sprites, animation, cameras, tile maps, platformer physics, combat, HUD, and game flow before advanced topics.',
    level: 'intermediate',
    section: 'Game Flow',
    order: 48,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'You moved from single surfaces to structured game objects. Sprites and groups handle updates and drawing. Custom events schedule work. kill() cleans up entities without manual list surgery.',
      },
      {
        type: 'p',
        text: 'Animation, scrolling, cameras, and tile data turn a window demo into a world. Gravity, jumps, collisions, patrols, health, and HUD make that world playable. States and config keep the project maintainable.',
      },
      { type: 'h2', text: 'Skills checklist' },
      {
        type: 'ul',
        items: [
          'Subclass Sprite with image, rect, and update(dt, ...).',
          'Organize objects in Group / GroupSingle and draw them together.',
          'Slice sprite sheets and drive frame animation with dt.',
          'Scroll backgrounds and follow the player with a clamped camera.',
          'Load tile maps from data and collide against solid rects.',
          'Implement gravity, grounded jumps, and clearer collision responses.',
          'Add patrol enemies, damage with i-frames, and a screen-space HUD.',
          'Structure menus, pause, game over, settings, and gamepad input.',
        ],
      },
      { type: 'h2', text: 'Quick practice scene' },
      {
        type: 'code',
        language: 'python',
        title: 'Review drill',
        code: `import pygame

# In one short script, demonstrate:
# 1) a Player(Sprite) in a GroupSingle
# 2) coins in a Group, removed with kill() on contact
# 3) gravity + jump with an on_ground flag
# 4) a camera offset when blitting
# 5) a Menu vs Play flag or tiny state objects

pygame.init()
screen = pygame.display.set_mode((800, 450))
clock = pygame.time.Clock()
# ... build the drill with the patterns from earlier lessons ...
pygame.quit()`,
      },
      {
        type: 'note',
        text: 'If any checklist item still feels shaky, reopen that lesson and rebuild the sample from memory before moving to advanced topics like tilemap editors, particles, or shaders.',
      },
      {
        type: 'tip',
        text: 'Keep your platformer project as a portfolio base. Advanced lessons will plug into the same state and sprite structure.',
      },
      {
        type: 'try',
        text: 'Without copying, write a 100-line mini platformer that includes groups, gravity, one enemy, and a pause overlay. Compare it with your project code afterward.',
      },
      {
        type: 'keypoints',
        items: [
          'Sprites and groups are the backbone of pygame architecture.',
          'World systems (camera, tiles, scrolling) separate simulation from view.',
          'Platformer feel comes from gravity, grounding, and collision details.',
          'States, config, and HUD turn prototypes into games you can ship and extend.',
        ],
      },
    ],
  },
];
