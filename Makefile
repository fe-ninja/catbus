specs := $(shell find ./tests -name '*-spec.js' ! -path "*node_modules/*")
test:
	@node_modules/.bin/mocha  ${specs}

jsfiles := $(shell find ./ -name '*.js' ! -path "*node_modules/*" ! -path "*scripts/*");
lint:
	@node_modules/.bin/jshint ${jsfiles}

.PHONY:   test lint 