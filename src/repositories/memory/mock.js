const { Admin } = require('../../models/Admin');
const { AdminRepository } = require('./Admin');
const { Comment } = require('../../models/Comment');
const { CommentRepository } = require('./Comment');
const { Group } = require('../../models/Group');
const { GroupRepository } = require('./Group');
const { Post } = require('../../models/Post');
const { PostRepository } = require('./Post');
const { User } = require('../../models/User');
const { UserRepository } = require('./User');

const randomInt = (min = 0, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomEl = (array = []) => {
  if (array.length < 1) {
    return array[0];
  }

  return array[randomInt(0, array.length - 1)];
};

const initData = () => {
  const adminRepository = new AdminRepository();
  [
    {
      login: 'admin',
      mail: 'admin@example.com',
      name: 'Pan Admin',
      gender: true,
    },
  ].forEach(data => adminRepository.add(new Admin(data)));

  const userRepository = new UserRepository();
  [
    {
      login: 'janusz',
      mail: 'janusz@example.com',
      name: 'Janusz Januszewicz',
      gender: true,
    },
    {
      login: 'halinka',
      mail: 'hania@example.com',
      name: 'Halina Halinowa',
      gender: false,
    },
    {
      login: 'andrzej',
      mail: 'andrzejek@example.com',
      name: 'Andrzej Andrew',
      gender: true,
    },
    {
      login: 'marcin',
      mail: 'marcin@example.com',
      name: 'Marcin M',
      gender: true,
    },
    {
      login: 's12609',
      mail: 's12609@example.com',
      name: 'Marcin Mmm',
      gender: true,
    },
  ].forEach(data => userRepository.add(new User(data)));

  const groupRepository = new GroupRepository();
  [
    {
      name: 'programming',
      tag: 'programming',
      desctiption: 'Programming, Security, and other IT stuff',
    },
    {
      name: 'javascript',
      tag: 'javascript',
      desctiption: 'JavaScript',
    },
    {
      name: 'beer',
      tag: 'beer',
      desctiption: 'All about beers',
    },
    {
      name: 'BeerLovers',
      tag: 'beer-lovers',
      desctiption: 'Just for beer lovers',
    },
  ].forEach(data => groupRepository.add(new Group(data)));

  const postRepository = new PostRepository();
  [
    { url: 'http://google.com', desctiption: 'Ciekawa strona' },
    { url: 'http://onet.pl', desctiption: 'Wiadomośći onet' },
    { url: 'https://news.ycombinator.com', desctiption: 'Hacker News' },
    { url: 'https://twitter.com', desctiption: 'Twitter' },
  ].forEach(data => postRepository.add(new Post(data)));

  const commentRepository = new CommentRepository();
  [
    { content: 'Ciekawy link!' },
    { content: 'Nie znałem.' },
    { content: 'Nie podoba mi się to :(' },
    { content: 'XD' },
  ].forEach(data => commentRepository.add(new Comment(data)));

  // User 1 --owns-- * Group
  groupRepository.instances.forEach(group => {
    const owner = randomEl(userRepository.instances);
    group.owner = owner.id;
    owner.groupsCreated.push(group.id);
  });

  // User * --is in-- * Group
  groupRepository.instances.forEach(group => {
    group.users = userRepository.instances.map(user => user.id);
    userRepository.instances.forEach(user => {
      user.groupsIn.push(group.id);
    });
  });

  // User 1 --author-- * Post
  postRepository.instances.forEach(post => {
    const author = randomEl(userRepository.instances);
    post.author = author.id;
    author.posts.push(post.id);
  });

  // Post * --is in-- 1 Group
  postRepository.instances.forEach(post => {
    const group = randomEl(groupRepository.instances);
    post.group = group.id;
    group.posts.push(post.id);
  });

  // User 1 --author-- * Comment
  commentRepository.instances.forEach(comment => {
    const author = randomEl(userRepository.instances);
    comment.author = author.id;
    author.comments.push(comment.id);
  });

  // Comment * --about-- 1 Post
  commentRepository.instances.forEach(comment => {
    const post = randomEl(postRepository.instances);
    comment.post = post.id;
    post.comments.push(comment.id);
  });
};

module.exports = {
  initData,
};
