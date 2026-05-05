from langchain.tools import tool

@tool
def energy_calculator(units: float) -> str:
    """
    Calculates the electricity bill based on the number of units consumed.
    Slab Logic:
    - 0-100 units: ₹5/unit
    - 101-300 units: ₹7/unit
    - Above 300 units: ₹10/unit
    """
    try:
        bill = 0
        remaining_units = units
        
        # 0-100 units
        if remaining_units > 0:
            tier1 = min(remaining_units, 100)
            bill += tier1 * 5
            remaining_units -= tier1
            
        # 101-300 units
        if remaining_units > 0:
            tier2 = min(remaining_units, 200)
            bill += tier2 * 7
            remaining_units -= tier2
            
        # Above 300 units
        if remaining_units > 0:
            bill += remaining_units * 10
            
        return f"For {units} units, your estimated electricity bill is ₹{bill:.2f}. Logic: (0-100 @ ₹5, 101-300 @ ₹7, >300 @ ₹10)."
    except Exception as e:
        return f"Error calculating bill: {str(e)}"

@tool
def appliance_usage_estimator(appliance: str, hours: float) -> str:
    """
    Estimates the energy consumption of a specific appliance based on usage hours.
    Common appliances: AC (1.5kW), Refrigerator (0.2kW), LED Bulb (0.01kW), Fan (0.07kW), Geyser (2kW).
    """
    # Simplified wattage map in kW
    wattage_map = {
        "ac": 1.5,
        "air conditioner": 1.5,
        "refrigerator": 0.2,
        "fridge": 0.2,
        "led bulb": 0.01,
        "bulb": 0.01,
        "fan": 0.07,
        "geyser": 2.0,
        "heater": 1.5,
        "tv": 0.1,
        "laptop": 0.06,
        "microwave": 1.2
    }
    
    appliance_lower = appliance.lower()
    wattage = wattage_map.get(appliance_lower, 0.5) # Default to 0.5kW if unknown
    
    consumption = wattage * hours
    return f"A typical {appliance} ({wattage}kW) running for {hours} hours consumes approximately {consumption:.2f} kWh (units)."
