#!/usr/bin/env node

from = process.argv[2]

files = {}
file = null

parser = startParser
require("fs").readFileSync(from,"utf-8").split("\n").forEach(function(line) {
  parser = parser(line)
})

Object.keys(files).forEach(function(key) {
  var src = output(files[key])
  require("fs").writeFileSync(key,src + "\n");
})

function startParser(line) {
  var match = /^\[\/\/\]\: # ([^:]+)(?::(\d+))/.exec(line)
  if(match)
    return segementParser(match[1],parseInt(match[2]))
  else
    return startParser
}

function segementParser(file,segment) {
  started = false
  lines = []
  return function parseLine(line) {
    if(/^```/.test(line)) {
      if(started) {
        files[file] = files[file] || []
        files[file][segment] = lines
        return startParser
      } else {
        started = true
      }
    } else {
      if(started) lines.push(line)
    }
    return parseLine
  }
}

function output(segs) {
  return segs.map(function(ls) {
    return ls.join("\n")
  }).join("\n")
}




