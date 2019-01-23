# child.rb

class Child

	attr_reader :name

	def initialize(name)
		@name = name

		@needs = {
			food: { val: 10, hours: 12 }, # Goes down by one for every 12 hours, or 1 day
			water: { val: 10, hours: 4 } # Goes down by one every four hours, or 2 after sleeping
		}

		@love = 20
	end

	## Returns string indicating status of the child
	def status
		str = ''

		@needs.each do |need, value|
			case need
			when :food
				food = @needs[:food][:val]
				if food >= 9
					str += "#{@name} is full."
				elsif food >= 6
					str += "#{@name} is hungry."
				elsif food >= 3
					str += "#{@name} is starving."
				elsif food >= 1
					str += "#{@name} is dying of starvation."
				else
					str += "#{@name} is dead for lack of food."
				end
			when :water
				water = @needs[:water][:val]
				if water >= 10
					str += "#{@name} is not thirsty."
				elsif water >= 8
					str += "#{@name} wants a little water."
				elsif water >= 5
					str += "#{@name} is thirsty."
				elsif water >= 1
					str += "#{@name} is dying of thirst."
				else
					str += "#{@name} is dead for lack of water."
				end
			end

			str += "\n"
		end

		if @love >= 95
			str += "#{@name} loves you.\n"
		elsif @love >= 80
			str += "#{@name} feels warmly towards you.\n"
		elsif @love >= 60
			str += "#{@name} feels for you.\n"
		elsif @love >= 40
			str += "#{@name} wants to feel for you.\n"
		elsif @love >= 20
			str += "#{@name} recognizes you.\n"
		elsif @love >= 10
			str += "#{@name} feels hurt by you.\n"
		else
			str += "#{@name} hates you.\n"
		end

		str
	end

	## Feed the child that replenishes the amount of food points provided
	def feed(amount)
		@needs[:food][:val] += amount
		@needs[:food][:val] = 10 if @needs[:food][:val] > 10
	end

	## Give the child water that replenishes the amount of water points provided
	def water(amount)
		@needs[:water][:val] += amount
		@needs[:water][:val] = 10 if @needs[:water][:val] > 10
	end

	## Handles passage of time in hours
	def time_passed(hours)
		hours.times do
			@needs[:food][:hours] -= 1
			@needs[:water][:hours] -= 1

			if @needs[:food][:hours] <= 0
				@needs[:food][:hours] = 12
				@needs[:food][:val] -= 1
			end

			if @needs[:water][:hours] <= 0
				@needs[:water][:hours] = 4
				@needs[:water][:val] -= 1
			end
		end
	end

	## Handles a day passing
	def day_passed
		@needs[:food][:hours] = 12
		@needs[:food][:val] -= 1
	end

	## Returns true if this child can eat right now
	def can_eat?
		@needs[:food][:val] < 10
	end

	def thirsty?
		@needs[:water][:val] < 10
	end

	def dead?
		@needs[:food][:val] <= 0
	end
end