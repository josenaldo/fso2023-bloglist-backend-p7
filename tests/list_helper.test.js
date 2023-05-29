const listHelper = require('../utils/list_helper')

const undefinedBlog = undefined

const emptyListOfBlog = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
]

const listOfSeveralBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const listOfSeveralTopBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'About the sequentiality of process descriptions.',
    author: 'Edsger W. Dijkstra',
    url: 'https://www.cs.utexas.edu/users/EWD/translations/EWD35-English.html',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of undefined list is zero', () => {
    const result = listHelper.totalLikes(undefinedBlog)
    expect(result).toBe(0)
  })

  test('of empty lists is zero', () => {
    const result = listHelper.totalLikes(emptyListOfBlog)
    expect(result).toBe(0)
  })

  test('of a list with one blog is equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test("of a bigger list are calculated by adding each blog's likes", () => {
    const result = listHelper.totalLikes(listOfSeveralBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  const favoriteOfOneBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5,
  }

  const favoriteOfSeveralBlogs = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  }

  const favoriteOfSeveralTopBlogs = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  }

  test('of undefined list is undefined', () => {
    const result = listHelper.favoriteBlog(undefinedBlog)
    expect(result).toBeUndefined()
  })

  test('of empty list is undefined', () => {
    const result = listHelper.favoriteBlog(emptyListOfBlog)
    expect(result).toBeUndefined()
  })

  test('of a list with one blog is equal to that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(favoriteOfOneBlog)
  })

  test('of a list with several blogs is equal of the blog that has most likes', () => {
    const result = listHelper.favoriteBlog(listOfSeveralBlogs)
    expect(result).toEqual(favoriteOfSeveralBlogs)
  })

  test('of a list with two or more top favorites is the first blog of the top favorites', () => {
    const result = listHelper.favoriteBlog(listOfSeveralTopBlogs)
    expect(result).toEqual(favoriteOfSeveralTopBlogs)
  })
})

describe('most blogs', () => {
  const expectedMostBlogsForOneBlog = {
    author: 'Edsger W. Dijkstra',
    blogs: 1,
  }

  const expectedMostBlogsForSeveralBlogs = {
    author: 'Robert C. Martin',
    blogs: 3,
  }

  const expectedMostBlogsForSeveralMostBlogs = {
    author: 'Edsger W. Dijkstra',
    blogs: 3,
  }

  test('of undefined list is undefined', () => {
    const result = listHelper.mostBlogs(undefinedBlog)
    expect(result).toBeUndefined()
  })

  test('of empty list is undefined', () => {
    const result = listHelper.mostBlogs(emptyListOfBlog)
    expect(result).toBeUndefined()
  })

  test('of a list with one blog is equal to the author of this blog and one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual(expectedMostBlogsForOneBlog)
  })

  test('of a several blogs list is equal to expectedMostBlogsForSeveralBlogs', () => {
    const result = listHelper.mostBlogs(listOfSeveralBlogs)
    expect(result).toEqual(expectedMostBlogsForSeveralBlogs)
  })

  test('of a several most blogs list is equal to expectedMostBlogsForSeveralMostBlogs', () => {
    const result = listHelper.mostBlogs(listOfSeveralTopBlogs)
    expect(result).toEqual(expectedMostBlogsForSeveralMostBlogs)
  })
})

describe('most likes', () => {
  const mostLikesToOneBlog = {
    author: 'Edsger W. Dijkstra',
    likes: 5,
  }

  const mostLikesToSeveralBlogs = {
    author: 'Edsger W. Dijkstra',
    likes: 17,
  }

  const mostLikesToSeveralTopBlogs = {
    author: 'Edsger W. Dijkstra',
    likes: 24,
  }

  test('of undefined list is undefined', () => {
    const result = listHelper.mostLikes(undefinedBlog)
    expect(result).toBeUndefined()
  })

  test('of empty list is undefined', () => {
    const result = listHelper.mostLikes(emptyListOfBlog)
    expect(result).toBeUndefined()
  })

  test("of a list with one blog is equal to the author of this blog and the same number of this blog's likes", () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual(mostLikesToOneBlog)
  })

  test('of a list with several blogs is equal to the author with more likes and the total of likes this author has', () => {
    const result = listHelper.mostLikes(listOfSeveralBlogs)
    expect(result).toEqual(mostLikesToSeveralBlogs)
  })

  test('of a list with more than one top author is the first of these authors, being that the authors are sorted alphabetically', () => {
    const result = listHelper.mostLikes(listOfSeveralTopBlogs)
    expect(result).toEqual(mostLikesToSeveralTopBlogs)
  })
})
