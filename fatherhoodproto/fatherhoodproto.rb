#!/usr/bin/env ruby
# Prototype for caring for your kids part of the game
require 'byebug'

require_relative 'lib/child.rb'
require_relative 'lib/dad.rb'
require_relative 'lib/home.rb'

### GAME LOOP
home = Home.new

puts home.status.chomp

while true
	# Check success
	if home.is_won?
		puts 'You won!'
		puts "\nLet's take a look at your score...\n"
		puts home.score
	elsif home.is_lost?
		puts "#{home.child.name} is dead."
		exit 0
	end

	# Get command from user
	print '> '
	raw_command = gets.chomp.downcase
	full_command = raw_command.split.map(&:to_sym)
	verb = full_command[0]
	args = full_command[1..-1]

	# Manage input and print out to user
	case verb
	when :status
		puts home.status
	when :hours
		puts "You have #{home.dad.hours_left} hours left today."
	when :quit
		exit 0
	when :stats
		puts home.child.inspect
	else
		begin
			puts home.public_send(verb, args)
		rescue
			puts "I don't understand \"#{raw_command}\""
		end		
	end
end